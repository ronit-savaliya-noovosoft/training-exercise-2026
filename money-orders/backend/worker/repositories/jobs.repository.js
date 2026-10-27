const db = require("../../config/db");
const queries = require('../queries/jobs.queries');

async function createJob(client, type, data = {}){
    const result = await client.query(queries.INSERT_JOB, [type, data]);

    return result.rows[0];
}

async function getPendingJobs(limit=10){
    const client = await db.connect();

    try{
        await client.query("BEGIN");

        const result = await client.query(queries.FETCH_PENDING_JOBS, [limit]);

        const jobs = [];

        for(const job of result.rows){
            const claimedJob = await client.query(queries.MARK_JOB_IN_PROCESS, [job.id]);

            if(claimedJob.rows.length > 0){
                jobs.push(claimedJob.rows[0]);
            }
        }

        await client.query("COMMIT");

        return jobs;
    }
    catch (e){
        await client.query("ROLLBACK");
        throw e;
    }
    finally {
        client.release();
    }
}

// async function updateJobStatus(id, status){
//     const result = db.query(queries.UPDATE_JOB_STATUS, [id, status]);
//
//     return result.rows[0];
// }

async function markJobCompleted(id){
    const result = await db.query(queries.MARK_JOB_COMPLETED, [id]);

    return result.rows[0];
}

async function markJobFailed(id, message){
    const result = await db.query(queries.MARK_JOB_FAILED, [id, message]);

    return result.rows[0];
}

// async function incrementJobAttempts(id){
//     const result = db.query(queries.INCREMENT_JOB_ATTEMPTS, [id]);
//
//     return result.rows[0];
// }


module.exports = {
    createJob,
    getPendingJobs,
    // updateJobStatus,
    markJobCompleted,
    markJobFailed,
    // incrementJobAttempts,
    // getJobs,
    // countJobs,
}