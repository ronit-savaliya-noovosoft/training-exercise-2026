const db = require("../config/db");
const queries = require("../queries/transaction.queries");
const accountQueries = require("../queries/account.queries");

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

    console.log(`Inserted Row ${result.rows[0]}`);

    return result.rows[0];
}

function getVisibilityFilter(user){
    if(user.role === 'manager'){
        return { sql: "t.created_by = $1", params: [user.id]};
    }

    return {
        sql: `(sender.id = $1 OR receiver.id = $1)
            AND (fa.id = $2 OR ta.id = $2)`,
        params: [Number(user.id), Number(user.activeAccountId)]
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
        LIMIT $${filter.params.length+1} OFFSET $${filter.params.length+2}`,
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

async function getTransactionsForEmail(customerId, type, fromDate, toDate, accountId, limit){
    const result = await db.query(
        queries.GET_TRANSACTIONS_FOR_EMAIL,
        [customerId, type, fromDate, toDate, accountId, limit]
    );

    return result.rows;
}

async function getAccountByCustomerId(custId, accountId){
    const result = await db.query(
        accountQueries.GET_ACCOUNT_OF_CUSTOMER,
        [accountId, custId]
    );

    return result.rows[0].id;
}

module.exports = {
    createTransactions,
    getTransactionHistory,
    getTransactionsForEmail,
    getAccountByCustomerId
};