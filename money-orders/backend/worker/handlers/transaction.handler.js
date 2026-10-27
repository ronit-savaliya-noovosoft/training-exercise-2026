const transactionRepository = require("../repositories/transaction.repository");
const { JOB_TYPE } = require("../constants/jobs.constants");

async function handleTransaction(job){
    const transactionId = job.data.transactionId;

    if(!transactionId){
        throw new Error("transaction ID is missing from job data");
    }

    await transactionRepository.withTransaction(async (client) => {
       const transaction = await transactionRepository.getTransactionForUpdate(client, transactionId);

       console.log(transactionId);
       console.log(transaction);

       if(!transaction){
           throw new Error("Transaction not found");
       }

       if(transaction.type !== job.type){
           throw new Error("Job type does not match transaction type");
       }

       const {
           id,
           type,
           from_account_id: fromAccountId,
           to_account_id: toAccountId,
           amount
       } = transaction;

       const accountIds = [
           fromAccountId, toAccountId
       ].filter(id => id!==null);

       const accounts = await transactionRepository.getAccountsForUpdate(client, accountIds);

       if(accounts.length !== new Set(accountIds).size){
           await transactionRepository.markFailed();
       }

       if(type === JOB_TYPE.DEPOSIT){
           await transactionRepository.depositAmount(client, amount, toAccountId);
       }

       else if(type === JOB_TYPE.WITHDRAWAL){
           const account = accounts.find(account => account.id === fromAccountId);

           const success = await processWithdrawal(client, amount, account);

           if(!success){
               await transactionRepository.markFailed(client, id);
               return;
           }
       }

       else if(type === JOB_TYPE.TRANSFER){
           const account = accounts.find(account => account.id === fromAccountId);

           const success = await processWithdrawal(client, amount, account);

           if(!success){
               await transactionRepository.markFailed(client, id);
               return;
           }

           await transactionRepository.depositAmount(client, amount, toAccountId);
       }

       else{
           throw new Error(`Unsupported transaction type: ${type}`);
       }

       await transactionRepository.markCompleted(client, id);
    });
}

async function processWithdrawal(client, amount, account){
    if(Number(account.balance) < Number(amount)){
        return false;
    }

    return await transactionRepository.withdrawAmount(client, amount, account.id);
}

module.exports = { handleTransaction };