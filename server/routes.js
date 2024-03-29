const database = require('./database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('./keys.js');
const mongoose = require('mongoose');

// Load input validation
const validateRegisterInput = require('./validation/register');
const validateLoginInput = require('./validation/login');

const Account = require('./Schemas/Account');
const Trip = require('./Schemas/Trip');

let pool;

async function run() {
  try {
    pool = await database.initialize();
  } catch (err) {
    pool = 'err';
    console.error(err);
    process.exit(1);
  }
}

run();

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

// registration

async function register(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Account.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    } else {
      const newUser = new Account({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        username: req.body.username,
      });

      //Hashing the password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
}

async function login(req, res) {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  Account.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: 'Username not found' });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      } else {
        return res.status(400).json({ message: 'Password incorrect' });
      }
    });
  });
}

// dummy function to show functionality
async function test(req, res) {
  let query = `SELECT * FROM Emission`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// 1A
async function twoCities(req, res) {
  let given_city1_id = req.params.city1;
  let given_city2_id = req.params.city2;

  let query = `SELECT *
    FROM City C
    WHERE C.id = ${given_city1_id}
    UNION 
    SELECT *
    FROM City C
    WHERE C.id = ${given_city2_id}
    `;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// 1b
async function getEpaScore(req, res) {
  let given_id = req.params.id;

  let query = `SELECT E.epa_score
    FROM Vehicle V JOIN  Emission E ON V.id = E.vehicle_id
    WHERE V.id=${given_id}
    `;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// 2
async function mostEfficientVehicles(req, res) {
  let given_year = req.params.year;

  let query = `SELECT V.id, V.make, V.model
	FROM Vehicle V, Emission E
	WHERE V.id = E.vehicle_id AND
 		   V.year = ${given_year}
	ORDER BY E.epa_score DESCENDING
	LIMIT 10`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// 3
async function rankByMPG(req, res) {
  let query = `WITH avgMpgVehicles AS 
	(
		SELECT V.id AS id, (V.hwympg1 + V.citympg1)/2 AS avgmpg
		FROM Vehicle V
		)
		SELECT V.id, V.year, V.make, V.model, A.avgmpg
		FROM Vehicle V, avgMpgVehicles A
		WHERE V.id = A.id
		ORDER BY A.avgmpg DESCENDING
		LIMIT 10
    `;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  // handle the promise
  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// 4
async function bestElectric(req, res) {
  let given_state = req.params.state;

  let query = `WITH Electric AS
	(
		SELECT *
		FROM Vehicle
		WHERE (highwayE IS NOT NULL) or (cityE IS NOT NULL)
	),
	Plants AS
	(
		SELECT *
		FROM powerplant
		WHERE Plant_State = ${given_year}
	)
	SELECT E.id, E.make, E.model
	FROM Electric E, powerplant P
	ORDER BY (P.MMBtu/1000000 / P.Net_Generation * E.highwayE/1000) DESC`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function allElectricMakes(req, res) {
  let query = `
  SELECT MAX(id), make
	FROM Vehicle
  WHERE fueltype1='Electricity'
  GROUP BY make
  ORDER BY make`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function allElectricModels(req, res) {
  let make = req.params.make;

  let query = `
  SELECT MAX(id), model
	FROM Vehicle
  WHERE fueltype1='Electricity' and make='${make}'
  GROUP BY model
  ORDER BY model`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getCarId(req, res) {
  let make = req.body.make;
  let year = req.body.year;
  let model = req.body.model;

  let query = `
  SELECT id
  FROM Vehicle
  WHERE make='${make}' AND year=${year} AND model='${model}'
  `;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// Inputs to 5
async function getPlantPairsInputs(req, res) {
  const { year, state, name, fuel } = req.body;

  let query = `
  SELECT MAX(plant_id), rep_primemover
  FROM Powerplant
  WHERE YEAR=${year} AND plant_state='${state}'
    AND plant_name='${name}' AND rep_fueltype='${fuel}'
  GROUP BY plant_id, rep_primemover`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// 5
async function bestElectricPowerplantPairs(req, res) {
  let plant_id = req.body.plant_id;
  let year = req.body.year;
  let rep_prime = req.body.prime_mover;
  let vehicle_id = req.body.vehicle_id;
  let fueltype = req.body.fueltype;

  let query = `
    WITH Electric AS
    (
      SELECT *
      FROM Vehicle
      WHERE fueltype1='Electricity'
    ),
    PlantsConsidered AS (
        SELECT NETGEN, plant_id, plant_state, rep_primemover, rep_fueltype,
          ELEC_FUELCON, plant_name, ELEC_FUELCON / 1000000 / NETGEN as compute2
        FROM powerplant
        WHERE YEAR=${year} AND NETGEN>0
    ),
    GivenPlant AS
    (
        SELECT ELEC_FUELCON, NETGEN
        FROM PlantsConsidered
        WHERE (plant_id = ${plant_id} AND REP_PRIMEMOVER='${rep_prime}' AND REP_FUELTYPE='${fueltype}')
    ),
    GivenCar AS
    (
    SELECT *
    FROM Electric
    WHERE id=${vehicle_id}
    ),
    GivenThreshold AS (
        SELECT GivenPlant.ELEC_FUELCON /1000000 / GivenPlant.NETGEN * GivenCar.hwympg2/1000 AS compute
        FROM GivenPlant, GivenCar
    )
    SELECT *
    FROM (SELECT Electric.MAKE, Electric.MODEL, plants.plant_name, plants.plant_state
        FROM Electric, PlantsConsidered plants
        WHERE (Exists (SELECT * FROM GivenThreshold))
            AND EXISTS (SELECT * FROM GivenThreshold WHERE (plants.compute2 * Electric.hwympg2/1000) >= GivenThreshold.compute)
        ORDER BY (plants.compute2 * Electric.hwympg2/1000) DESC) x
    where ROWNUM < 6
    `;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// 6
async function typeOfFuel(req, res) {
  let given_state = req.params.state;

  `WITH GivenPlant AS
    (
        SELECT *
        FROM powerplant
        WHERE Plant_State = ${given_state}
    )
        SELECT * FROM 
            (
                SELECT Rep_Fuel_Type
                FROM GivenPlant
                ORDER BY Netgen DESC
            )
        LIMIT 1`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// get all cities in database
async function getAllCities(req, res) {
  let query = `SELECT * FROM City ORDER BY COUNTRY ASC, NAME ASC`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getAllMakes(req, res) {
  let query = `SELECT MAX(ID), MAKE FROM Vehicle GROUP BY MAKE ORDER BY MAKE ASC`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getModels(req, res) {
  let make = req.params.make;

  let query = `SELECT MAX(ID), MODEL
  FROM Vehicle 
  WHERE MAKE='${make}'
  GROUP BY MODEL
  ORDER BY MODEL ASC`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getYears(req, res) {
  let make = req.params.make;
  let model = req.params.model;

  let query = `SELECT MAX(ID), YEAR
    FROM Vehicle 
    WHERE MAKE='${make}' AND 
        MODEL='${model}'
    GROUP BY YEAR
    ORDER BY YEAR DESC`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getPowerYears(req, res) {
  let query = `SELECT YEAR
    FROM Powerplant
    GROUP BY YEAR
    ORDER BY YEAR DESC`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getStates(req, res) {
  let query = `SELECT plant_state
    FROM powerplant 
    GROUP BY plant_state
    ORDER BY plant_state`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getCarInfo(req, res) {
  let id = req.params.id;

  let query = `SELECT *
    FROM Vehicle
    WHERE ID=${id}`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getPlantNames(req, res) {
  let state = req.params.state;
  let year = req.params.year;

  let query = `SELECT plant_name
    FROM Powerplant
    WHERE year=${year} AND plant_state='${state}'
    GROUP BY plant_name
    ORDER BY plant_name ASC`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getPlantFuels(req, res) {
  let state = req.params.state;
  let year = req.params.year;
  let name = req.params.name;

  let query = `SELECT rep_fueltype
    FROM Powerplant
    WHERE year=${year} AND plant_state='${state}' AND plant_name='${name}'
    GROUP BY rep_fueltype
    ORDER BY rep_fueltype ASC`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function getEPA(req, res) {
  let year = req.params.year;
  let score = req.params.score;

  year = year < 2008 ? 2008 : year;

  let query = `SELECT CO2 FROM EPA WHERE YEAR=${year} AND RATING=${score}`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// function to get stats for top 10 models for a make
async function getStatsMake(req, res) {
  let make = req.params.make;
  let query = `SELECT *
  FROM
  (SELECT MAKE, MODEL, HWYMPG1
    FROM Vehicle
    WHERE Make = '${make}'
    GROUP BY MAKE, MODEL, HWYMPG1
    ORDER BY HWYMPG1 DESC)
  WHERE ROWNUM < 11`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

// function to get stats for top 10 models for a make
async function getStatsYear(req, res) {
  let year = req.params.year;
  let query = `SELECT *
  FROM (SELECT MAKE, MODEL, HWYMPG1 FROM Vehicle
  WHERE Year = '${year}'
  GROUP BY MAKE, MODEL, HWYMPG1
  ORDER BY HWYMPG1 DESC)
  WHERE ROWNUM < 11`;

  const queryDB = async () => {
    let connection = await pool.getConnection();
    result = await connection.execute(query);

    await connection.close();
    return result;
  };

  queryDB()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.error(err.message));
}

async function addToTrips(req, res) {
  let username = req.params.username;
  let srcID = req.params.src;
  let destID = req.params.dest;
  let carID = req.params.vehicle;
  let distance = req.params.distance;

  Trip.findOne({
    sourceCity: srcID,
    destinationCity: destID,
    distance: distance,
    vehicle: carID,
  }).then((trip) => {
    if (trip) {
      return res.status(200).json({ message: 'Trip already exists' });
    } else {
      const newTrip = new Trip({
        sourceCity: srcID,
        destinationCity: destID,
        distance: distance,
        vehicle: carID,
        user: username,
      });

      newTrip
        .save()
        .then((t) => {
          Account.findOne({ username }).then((user) => {
            if (!user) {
              return res
                .status(200)
                .json({ message: 'User does not exist (somehow wtf)' });
            } else {
              user.routes.push(newTrip);
              user.save().then((resp) => res.json(resp));
            }
          });
          res.json(user);
        })
        .catch((err) => console.log(err));
    }
  });
}

async function getTrips(req, res) {
  const username = req.params.username;

  Account.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(400).json({ message: 'user does not exist homeboy' });
    } else {
      return res.status(200).json(user.routes);
    }
  });
}

async function removeTrip(req, res) {
  const objID = mongoose.Types.ObjectId(req.params.trip);
  const username = req.params.user;

  Account.findOneAndUpdate({ username }, { $pull: { routes: { _id: objID } } })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: 'something went wrong' });
      } else {
        Trip.findOneAndRemove({ _id: objID }).then(() => {
          return res.status(200).json(user);
        });
      }
    })
    .catch((err) => console.log(err));
}

module.exports = {
  login: login,
  register: register,
  twoCities: twoCities,
  getEpaScore: getEpaScore,
  mostEfficientVehicles: mostEfficientVehicles,
  rankByMPG: rankByMPG,
  bestElectric: bestElectric,
  getPlantPairsInputs: getPlantPairsInputs,
  allElectricMakes: allElectricMakes,
  allElectricModels: allElectricModels,
  getCarId: getCarId,
  bestElectricPowerplantPairs: bestElectricPowerplantPairs,
  typeOfFuel: typeOfFuel,
  getAllCities: getAllCities,
  getAllMakes: getAllMakes,
  getModels: getModels,
  getYears: getYears,
  getPowerYears: getPowerYears,
  getStates: getStates,
  getCarInfo: getCarInfo,
  getPlantNames: getPlantNames,
  getPlantFuels: getPlantFuels,
  getEPA: getEPA,
  addToTrips: addToTrips,
  getStatsMake: getStatsMake,
  getStatsYear: getStatsYear,
  getTrips: getTrips,
  removeTrip: removeTrip,
};
