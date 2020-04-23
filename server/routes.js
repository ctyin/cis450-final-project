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

async function getCars(req, res) {
    
    let given_city1_id = res.params.city1;
    let given_city2_id = res.params.city2;

    let query = `SELECT E.epa_score, C.latitude AS city1lat, C.longitude AS city1long
    FROM Emission E, City C, Vehicle V
    WHERE V.id = E.vehicle_id AND V.id = [given_vehicle_id] AND
        C.id = ${given_city1_id}
    UNION ALL
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

module.exports = {
    getCars: getCars,
    test: test
}