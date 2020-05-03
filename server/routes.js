let config = require('./db-config.js');
const oracledb = require('oracledb');

config.poolMax = 10;
let pool;

async function run() {
    try {
        pool = await oracledb.createPool(config);
    } catch(err) {
        console.error(err.message);
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
    }

    queryDB()
        .then(result => {
            return res.json(result);
        })
        .catch(err => console.error(err.message));

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
    }

    queryDB()
        .then(result => {
            return res.json(result);
        })
        .catch(err => console.error(err.message));

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
    }

    queryDB()
        .then(result => {
            return res.json(result);
        })
        .catch(err => console.error(err.message));

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
    }

    queryDB()
        .then(result => {
            return res.json(result);
        })
        .catch(err => console.error(err.message));

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
    }

    // handle the promise
    queryDB()
        .then(result => {
            return res.json(result);
        })
        .catch(err => console.error(err.message));
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
		FROM Powerplants
		WHERE Plant_State = ${given_year}
	)
	SELECT E.id, E.make, E.model
	FROM Electric E, Powerplants P
	ORDER BY (P.MMBtu/1000000 / P.Net_Generation * E.highwayE/1000) DESC`;

    const queryDB = async () => {
        let connection = await pool.getConnection();
        result = await connection.execute(query);

        await connection.close();
        return result;
    }

    queryDB()
        .then(result => {
            return res.json(result);
        })
        .catch(err => console.error(err.message));

}

// 5
async function bestElectricPowerplantPairs(req, res) {
    let plant_id = req.params.plant_id;
    let year = req.params.year;
    let rep_prime = req.params.prime_mover;
    let nunit_id = req.params.nunit_id;
    let vehicle_id = req.params.vehicle_id;
    let fueltype = req.params.fueltype;

    let query = `WITH Electric AS
    (
        SELECT *
        FROM Vehicle
        WHERE fueltype1='Electricity'
    ),
    GivenPlant AS
    (
        SELECT *
        FROM Powerplants
        WHERE (plant_id = ${plant_id} AND YEAR=${year} AND REP_PRIMEMOVER=${rep_prime} AND NUNIT_ID=${nunit_id} AND REP_FUELTYPE=${fueltype})
    ),
    GivenCar AS
    (
        SELECT *
        FROM Electric
        WHERE id=${vehicle_id}
    )
    SELECT Electric.MAKE, Electric.MODEL, plants.plant_name
    FROM Electric CROSS JOIN
        (SELECT * FROM PowerPlants WHERE YEAR=2016) plants, GivenPlant, GivenCar
    WHERE (plants.NETGEN > 0 AND GivenPlant.NETGEN > 0)
        AND (plants.ELEC_FUELCON / 1000000 / plants.NETGEN * Electric.hwympg2/1000) >= (GivenPlant.ELEC_FUELCON /1000000 / GivenPlant.NETGEN * GivenCar.hwympg2/1000);
    `;

    const queryDB = async () => {
        let connection = await pool.getConnection();
        result = await connection.execute(query);

        await connection.close();
        return result;
    }

    queryDB()
        .then(result => {
            return res.json(result);
        })
        .catch(err => console.error(err.message));

}

// 6
async function typeOfFuel(req, res) {
    let given_state = req.params.state;

    `WITH GivenPlant AS
    (
        SELECT *
        FROM Powerplants
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
    }

    queryDB()
        .then(result => {
            return res.json(result);
        })
        .catch(err => console.error(err.message));

}


module.exports = {
    twoCities: twoCities,
    getEpaScore: getEpaScore,
    mostEfficientVehicles: mostEfficientVehicles,
    rankByMPG: rankByMPG,
    bestElectric: bestElectric,
    bestElectricPowerplantPairs: bestElectricPowerplantPairs,
    typeOfFuel: typeOfFuel,    
}