const repository = require("../repositories/transaction.repository");

async function processNextTransaction(){
    return repository.withTransaction(
        async (client) => {
            const transaction = await repository.getNextPendingTransaction(client);

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
            }

            if(!['deposit', 'withdraw', 'transfer'].includes(type)){
                await repository.markFailed(client, id);
            }

            const accountIds = [from_account_id, to_account_id].filter(id => id!=null);

            // Pending to Check
            const accounts = await repository.getAccountsForUpdate(client, accountIds);
            console.log(accounts);

            if(accounts.length!==accountIds.length){
                await repository.markFailed(client, id);
                return true;
            }

            if(type==='deposit'){
                await repository.depositAmount(client, transactionAmount, to_account_id);
            }

            if(type==='withdraw'){
                if(accounts[0].balance<transactionAmount){
                    await repository.markFailed(client, id);
                    return true;
                }

                const withdrawn = repository.withdrawAmount(client, transactionAmount, from_account_id);

                if(!withdrawn){
                    await repository.markFailed(client, id);
                    return true;
                }
            }

            if(type==='transfer'){
                if(accounts[0].balance<transactionAmount){
                    await repository.markFailed(client, id);
                    return true;
                }

                const withdrawn = repository.withdrawAmount(client, transactionAmount, from_account_id);

                if(!withdrawn){
                    await repository.markFailed(client, id);
                    return true;
                }

                await repository.depositAmount(client, transactionAmount, to_account_id);
            }

            await repository.markCompleted(client, id);

            return true;
        }
    );
}

module.exports = { processNextTransaction };