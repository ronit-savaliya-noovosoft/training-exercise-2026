const { JOB_TYPE } = require("../constants/jobs.constants");
const jobsRepository = require("../repositories/jobs.repository");
const transactionHandler = require("../handlers/transaction.handler");
const emailHandler = require("../handlers/email.handler");

async function processJob(job){
    try{
        switch (job.type){
            case JOB_TYPE.DEPOSIT:
            case JOB_TYPE.WITHDRAWAL:
            case JOB_TYPE.TRANSFER:
                await transactionHandler.handleTransaction(job);
                break;
            case JOB_TYPE.MAIL:
                if(job.data.type==='TRANSACTIONS'){
                    await emailHandler.handleTransactionEmail(job);
                }
                else if(job.data.type==='ACCOUNT'){
                    await emailHandler.handleAccountEmail(job);
                }
                break;
            default:
                throw new Error(`Unknown job type: ${job.type}`);
        }

        await jobsRepository.markJobCompleted(job.id);
    }
    catch (e){
        console.log(e);
        await jobsRepository.markJobFailed(job.id, e.message);
    }
}

module.exports = { processJob };