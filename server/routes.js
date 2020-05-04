const database = require('./database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('./keys.js');

// Load input validation
const validateRegisterInput = require('./validation/register');
const validateLoginInput = require('./validation/login');

const Account = require('./Schemas/Account');

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
      console.log(req.body);

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

// Inputs to 5
async function getPlantPairsInputs(req, res) {
  const { year, state, name, fuel } = req.body;
  
  let query = `
  SELECT MAX(plant_id)
  FROM Powerplant
  WHERE YEAR=${year} AND plant_state=${state}
    AND plant_name=${name} AND rep_fueltype=${fuel}
  GROUP BY plant_id
  ORDER BY plant_id`;

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
    let plant_id = req.params.plant_id;
    let year = req.params.year;
    let rep_prime = req.params.prime_mover;
    let nunit_id = req.params.nunit_id;
    let vehicle_id = req.params.vehicle_id;
    let fueltype = req.params.fueltype;

    let query = `
    WITH Electric AS
    (
      SELECT *
      FROM Vehicle
      WHERE fueltype1='Electricity'
    ),
    PlantsConsidered AS (
        SELECT NETGEN, plant_id, rep_primemover, nunit_id, 
        rep_fueltype, ELEC_FUELCON, plant_name, ELEC_FUELCON / 1000000 / NETGEN as compute2
        FROM powerplant
        WHERE YEAR=${year} AND NETGEN>0
    ),
    GivenPlant AS
    (
        SELECT ELEC_FUELCON, NETGEN
        FROM PlantsConsidered
        WHERE (plant_id = ${plant_id} AND REP_PRIMEMOVER=${rep_prime} AND NUNIT_ID=${nunit_id} AND REP_FUELTYPE=${fueltype})
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
    FROM (SELECT Electric.MAKE, Electric.MODEL, plants.plant_name
        FROM Electric, PlantsConsidered plants
        WHERE (Exists (SELECT * FROM GivenThreshold))
            AND EXISTS (SELECT * FROM GivenThreshold WHERE (plants.compute2 * Electric.hwympg2/1000) >= GivenThreshold.compute)
        ORDER BY (plants.compute2 * Electric.hwympg2/1000) DESC) x
    where ROWNUM < 10;
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

module.exports = {
  login: login,
  register: register,
  twoCities: twoCities,
  getEpaScore: getEpaScore,
  mostEfficientVehicles: mostEfficientVehicles,
  rankByMPG: rankByMPG,
  bestElectric: bestElectric,
  getPlantPairsInputs: getPlantPairsInputs,
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
};
