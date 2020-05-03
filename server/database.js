const oracledb = require('oracledb');
const dbConfig = require('./db-config.js');

async function initialize() {
  const pool = await oracledb.createPool(dbConfig);
  return pool;
}

module.exports.initialize = initialize;
