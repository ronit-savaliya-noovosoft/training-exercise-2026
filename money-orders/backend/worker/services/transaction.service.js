const repository = require("../repositories/transaction.repository");
const { TRANSACTION_TYPE} = require("../../constants/transactions.constants");

const BATCH_SIZE = 10;

async function processNextTransaction(transactionId){
    return repository.withTransaction(
        async (client) => {
            const transaction = await repository.getTransactionForUpdate(client, transactionId);

            if(!transaction){
                return false;
            }

            const {
                id,
                type,
                from_account_id,
                to_account_id,
                amount
            } = transaction;

            const transactionAmount = Number(amount);

            if(!Number.isFinite(transactionAmount) || transactionAmount<=0){
                await repository.markFailed(client, id);
                return true;
            }

            if(!Object.values(TRANSACTION_TYPE).includes(type)){
                await repository.markFailed(client, id);
                return true;
            }

            const accountIds = [from_account_id, to_account_id].filter(id => id!=null);

            // Pending to Check
            const accounts = await repository.getAccountsForUpdate(client, accountIds);

            if(accounts.length!==accountIds.length){
                await repository.markFailed(client, id);
                return true;
            }

            if(type==='deposit'){
                await repository.depositAmount(client, transactionAmount, to_account_id);
            }

            if(type==='withdraw'){
                const success = await processWithdrawal(client, id, accounts[0].balance, transactionAmount, from_account_id);
                if(!success){
                    return true;
                }
            }

            if(type==='transfer'){
                let withdraw_account = accounts.find(x => x.id===from_account_id);

                const success = await processWithdrawal(client, id, withdraw_account.balance, transactionAmount, from_account_id);
                if(!success){
                    return true;
                }

                await repository.depositAmount(client, transactionAmount, to_account_id);
            }

            await repository.markCompleted(client, id);

            return true;
        }
    );
}

async function processPendingBatch(){
    const transactionIds = await repository.getPendingTransactionIds(BATCH_SIZE);

    if(transactionIds.length === 0){
        return 0;
    }

    let processedCount = 0;

    for(const transactionId of transactionIds){
        try{
            const processed = await processNextTransaction(transactionId);

            if(processed){
                processedCount++;
            }
        }
        catch (e){
            console.error(`Error processing transaction ${transactionIds}:`, e.message);
        }
    }

    return processedCount;
}

async function processWithdrawal(client, id, balance, amount, from_account_id){
    if(balance<amount){
        console.log(balance,"  ", amount);
        return false;
    }

    const withdrawn = await repository.withdrawAmount(client, amount, from_account_id);

    if(!withdrawn){
        console.log(withdrawn);
        return false;
    }

    return true;
}

module.exports = { processNextTransaction, processPendingBatch };