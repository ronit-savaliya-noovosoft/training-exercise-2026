const transactionService = require("./services/transaction.service");

const BATCH_SIZE = 10;
const POLL_INTERVAL = 5000;

const sleep = (ms) => {
    new Promise((resolve) =>
        setInterval(resolve, ms)
    )
}

async function startWorker(){
    console.log("Start Transaction Server!");

    while (true){
        try {
            let processCount=0;

            while (processCount<BATCH_SIZE){
                const found = await transactionService.processNextTransaction();

                if(!found){
                    break;
                }

                processCount++;
            }
        }
        catch (e){
            console.error("Transaction worker error:", e.message);
        }

        sleep(POLL_INTERVAL);
    }
}

startWorker();