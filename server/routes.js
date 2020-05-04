let config = require('./db-config.js');
const oracledb = require('oracledb');
const database = require('./database.js');

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

  let query = `SELECT C.latitude AS city1lat, C.longitude AS city1long
    FROM City C
    WHERE C.id = ${given_city1_id}
    UNION 
    SELECT C.latitude AS city2lat, C.longitude AS city2long
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
  let given_make = req.params.make;
  let given_model = req.params.model;
  let given_year = req.params.year;

  let query = `SELECT E.epa_score
    FROM Vehicle V JOIN  Emission E ON V.id = E.vehicle_id
    WHERE V.make = ${given_make} AND V.model = ${given_model} AND V.year = ${given_year}
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
  let query = `SELECT * FROM City`;

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
  let query = `SELECT State
    FROM powerplant 
    GROUP BY State
    ORDER BY State`;

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
  twoCities: twoCities,
  getEpaScore: getEpaScore,
  mostEfficientVehicles: mostEfficientVehicles,
  rankByMPG: rankByMPG,
  bestElectric: bestElectric,
  bestElectricPowerplantPairs: bestElectricPowerplantPairs,
  typeOfFuel: typeOfFuel,
  getAllCities: getAllCities,
  getAllMakes: getAllMakes,
  getModels: getModels,
  getYears: getYears,
  getPowerYears: getPowerYears,
  getStates: getStates,
};
