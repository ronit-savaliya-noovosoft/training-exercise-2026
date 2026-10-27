const jobsRepository = require("./repositories/jobs.repository");
const jobsService = require("./services/jobs.service");

const BATCH_SIZE = 10;
const POLL_INTERVAL = 5000;

async function processJobs(){
    const jobs = await jobsRepository.getPendingJobs(BATCH_SIZE);

    console.log(jobs);
    for(const job of jobs){
        await jobsService.processJob(job);
    }
}

async function startWorker(){
    console.log("Jobs worker started");

    try{
        await processJobs();
    }
    catch (e){
        console.error("Worker Error:", e.message);
    }

}

setInterval(startWorker, POLL_INTERVAL);
