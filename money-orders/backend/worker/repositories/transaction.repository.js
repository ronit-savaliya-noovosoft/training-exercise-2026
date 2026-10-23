const db = require("../../config/db");
const queries = require("../queries/transaction.queries");

async function withTransaction(callback){
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const result = await callback(client);

        await client.query("COMMIT");

        return result;
    }
    catch (e){
        await client.query("ROLLBACK");
        throw e;
    }
    finally {
        client.release();
    }
}

async function getNextPendingTransaction(client){
    const result = await client.query(
        queries.GET_NEXT_PENDING_TRANSACTION
    );

    return result.rows[0];
}

async function getAccountsForUpdate(client, accountIds){
    const result = await client.query(
        queries.GET_ACCOUNTS_FOR_UPDATE,
        [accountIds]
    );

    return result.rows;
}

async function depositAmount(client, amount, accountId){
    await client.query(
        queries.DEPOSIT_AMOUNT,
        [amount, accountId]
    );
}

async function withdrawAmount(client, amount, accountId){
    const result = await client.query(
        queries.WITHDRAW_AMOUNT,
        [amount, accountId]
    )

    return result.rowCount > 0;
}

async function markCompleted(client, transactionId){
    await client.query(
        queries.MARK_TRANSACTION_COMPLETED,
        [transactionId]
    );
}

async function markFailed(client, transactionId){
    await client.query(
        queries.MARK_TRANSACTION_FAILED,
        [transactionId]
    );
}

module.exports = {
    withTransaction,
    getNextPendingTransaction,
    getAccountsForUpdate,
    depositAmount,
    withdrawAmount,
    markCompleted,
    markFailed
}