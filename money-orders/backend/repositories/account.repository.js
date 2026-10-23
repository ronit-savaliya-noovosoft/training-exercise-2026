const queries = require("../queries/account.queries");
const db = require("../config/db");

async function updateBalance(client, accountId, signedAmount){
    const result = await client.query(queries.UPDATE_BALANCE, [signedAmount, accountId]);

    if(result.rowCount===0){
        const error = new Error("Account not found");
        error.code = "ACCOUNT_NOT_FOUND";
        throw error
    }

    return result.rowCount;
}

async function getAccountForUpdate(client, accountId){
    const result = await client.query(queries.GET_ACCOUNT_FOR_UPDATE, [accountId]);

    return result.rows[0] || null;
}

async function getCustomerAccounts(){
    const result = await db.query(queries.GET_CUSTOMER_ACCOUNTS);

    return result.rows;
}

async function getAccountBalance(custId){
    const result = await db.query(queries.GET_ACCOUNT_BALANCE, [custId]);

    return result.rows[0] || null;
}

module.exports = { updateBalance, getAccountForUpdate, getCustomerAccounts, getAccountBalance };