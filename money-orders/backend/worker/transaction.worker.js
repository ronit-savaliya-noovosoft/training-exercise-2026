const transactionService = require("./services/transaction.service");
const {processPendingBatch} = require("./services/transaction.service");

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
            let processCount = await processPendingBatch();

            if(processCount > 0){
                console.log(`Process ${processCount} transaction(s).`)
            }
        }
        catch (e){
            console.error("Transaction worker error:", e.message);
        }

        sleep(POLL_INTERVAL);
    }
}

startWorker();