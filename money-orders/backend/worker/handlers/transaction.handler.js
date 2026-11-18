const transactionRepository = require("../repositories/transaction.repository");
const { JOB_TYPE } = require("../constants/jobs.constants");
const transporter = require("../../config/email");
const accountRepository = require("../../repositories/account.repository");

async function handleTransaction(job){
    const transactionId = job.data.transactionId;

    if(!transactionId){
        throw new Error("transaction ID is missing from job data");
    }

    await transactionRepository.withTransaction(async (client) => {
       const transaction = await transactionRepository.getTransactionForUpdate(client, transactionId);

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
           await transactionRepository.markFailed(client, id);
           return;
       }

       if(type === JOB_TYPE.DEPOSIT){
           await transactionRepository.depositAmount(client, amount, toAccountId);
           await mailForTransaction(type, amount, accounts[0]);
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
           const fromAccount = accounts.find(account => account.id === fromAccountId);
           const toAccount = accounts.find(account => account.id === toAccountId);

           const success = await processWithdrawal(client, amount, fromAccount);

           if(!success){
               await transactionRepository.markFailed(client, id);
               return;
           }

           await transactionRepository.depositAmount(client, amount, toAccountId);
           await mailForTransaction("deposit", amount, toAccount);
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

    const transaction = await transactionRepository.withdrawAmount(client, amount, account.id);
    await mailForTransaction("withdrawal", -amount, account);

    return transaction;
}

async function mailForTransaction(type, amount, account){
    const html = `
            <h3>Dear ${account.name},</h3>
            <p>Please be informed that a ${type} transaction has been processed for your account. Here are the details for your records:</p>
            <ul>
                <li>Transaction Type: ${type}</li>
                <li>Amount: ${Math.abs(amount)}</li>
                <li>Account/Reference Number: ${account.account_number}</li>
                <li>Current Balance: ${Number(account.balance)+Number(amount)}</li>
            </ul>
            <p>If you have any questions or need further assistance, please feel free to reply to this email or contact us.</p>
                
            <h3>Best regards,</h3>
            <h4>Money Order Bank Services</h4>
    `;

    await transporter.sendMail({
        from: '"Banking App" <banking-app@localhost>',
        to: account.email,
        subject: "Transaction alert!",
        html: html
    });
}

module.exports = { handleTransaction };