const queries = require("../queries/job.queries");
const db = require("../config/db");

async function getJobs(limit = 10, offset = 0){
    const result = await db.query(queries.GET_JOBS, [limit, offset]);

    return result.rows;
}

async function countJobs(){
    const result = await db.query(queries.COUNT_JOBS);

    return result.rows[0].total;
}

module.exports = { getJobs, countJobs }