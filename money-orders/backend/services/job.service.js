const jobRepository = require("../repositories/job.repository");

async function getJobHistory(query){
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(10, parseInt(query.limit) || 1);
    const offset = (page-1) * limit;

    const jobs = await jobRepository.getJobs(limit, offset);
    const total = await jobRepository.countJobs();

    console.log(jobs);
    return {
        status: "success",
        jobs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total/limit)
        }
    }
}

module.exports = { getJobHistory };