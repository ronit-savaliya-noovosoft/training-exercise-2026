const db = require("../config/db");
const queries = require("../queries/transaction.queries");

async function createTransactions(client, transaction){
    const {
        type,
        fromAccountId = null,
        toAccountId = null,
        amount,
        status,
        createdBy
    } = transaction;

    const result = await client.query(queries.INSERT_TRANSACTION, [
       type, fromAccountId, toAccountId, amount, status, createdBy
    ]);

    return result.rows[0];
}

function getVisibilityFilter(user){
    if(user.role === 'manager'){
        return { sql: "t.created_by = $1", params: [user.id]};
    }

    return {
        sql: "(sender.id = $1 OR receiver.id = $1)",
        params: [Number(user.id)]
    }
}

async function getTransactionHistory(user, { limit, offset }){
    const filter = getVisibilityFilter(user);

    // const countResult = await db.query(
    //     `${queries.COUNT_TRANSACTIONS_PREFIX}${filter.sql}`,
    //     filter.params
    // );

    const result = await db.query(
        `${queries.GET_TRANSACTION_HISTORY_PREFIX}${filter.sql}
        ORDER BY t.created_at DESC
        LIMIT $2 OFFSET $3`,
        [...filter.params, limit, offset]
    );

    if(result.rows.length === 0){
        return {
            status: "success",
            message: "No Transaction Found",
            transactions: result.rows
        }
    }

    return {
        transactions: result.rows,
        total: Number(result.rows[0].total_count)
    }
}

async function getTransactionsForEmail(customerId, type, fromDate, toDate, limit){
    const result = await db.query(
        queries.GET_TRANSACTIONS_FOR_EMAIL,
        [customerId, type, fromDate, toDate, limit]
    );

    return result.rows;
}

module.exports = { createTransactions, getTransactionHistory, getTransactionsForEmail };