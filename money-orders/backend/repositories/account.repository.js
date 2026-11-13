const queries = require("../queries/account.queries");
const db = require("../config/db");
const accountQueries = require("../queries/account.queries");

async function getCustomerAccounts(){
    const result = await db.query(queries.GET_CUSTOMER_ACCOUNTS);

    return result.rows;
}

async function getAccountBalance(custId, accountId){
    const result = await db.query(queries.GET_ACCOUNT_BALANCE,
        [custId, accountId]);

    return result.rows[0] || null;
}

async function getAccountBalanceByAccountId(accountId){
    const result = await db.query(queries.GET_ACCOUNT_BALANCE_BY_ACCOUNT_ID, [accountId]);

    return result.rows[0] || null;
}

async function getAccountDetails(client, accountId){
    const result = await client.query(queries.GET_ACCOUNT_DETAILS, [accountId]);

    return result.rows;
}

async function getMyAccounts(customerId){
    const result = await db.query(queries.GET_ACCOUNTS_OF_CUSTOMER,
        [customerId]);

    return result.rows;
}

async function getAccountByCustomer(accountId, customerId){
    const result = await db.query(queries.GET_ACCOUNT_OF_CUSTOMER,
        [accountId, customerId]);

    return result.rows[0];
}

async function createAccount(client, account_number, cust_id, balance){
    return await client.query(
        queries.CREATE_ACCOUNT,
        [account_number, cust_id, balance]
    );
}

async function getLastAccountNumber(){
    const result = await db.query(
        queries.GET_LAST_ACCOUNT_NO
    );

    return result.rows[0].max;
}

async function deactivateAccount(account_id){
    return await db.query(
        queries.DEACTIVATE_ACCOUNT,
        [account_id]
    );
}

async function getAllAccounts(limit = 10, offset = 0, search = null){
    const result = await db.query(queries.GET_ALL_ACCOUNTS,
        [limit, offset, search]);

    return result.rows;
}

async function countAccounts(){
    const result = await db.query(queries.COUNT_ACCOUNTS);

    return result.rows[0].total;
}

module.exports = {
    getCustomerAccounts,
    getAccountBalance,
    getAccountDetails,
    getAccountBalanceByAccountId,
    getMyAccounts,
    getAccountByCustomer,
    createAccount,
    getLastAccountNumber,
    deactivateAccount,
    getAllAccounts,
    countAccounts
};