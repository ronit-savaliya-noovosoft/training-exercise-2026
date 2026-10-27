const jobService = require("../services/job.service");

function sendError(res, error, fallbackFunction){
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: statusCode === 500 ? fallbackFunction : error.message
    });
}

async function getJobHistory(req, res){
    try{
        return res.json(await jobService.getJobHistory(req.query));
    }
    catch (e) {
        return sendError(res, e, "Failed to Fetch");
    }
}

module.exports = { getJobHistory };