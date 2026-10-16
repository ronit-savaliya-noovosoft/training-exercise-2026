const db = require("../config/db");
const queries = require("../queries/auth.queries");
const accountQueries = require("../queries/account.queries");

async function findUserByEmail(email){
    const result = await db.query(
        queries.LOGIN_USER,
        [email]
    );

    console.log(result);

    return result.rows[0];
}

async function getCustomerProfile(userId){
    const result = await db.query(
        queries.GET_CUSTOMER_PROFILE,
        [userId]
    );

    return result.rows[0];
}

async function getUserProfile(userId){
    const result = await db.query(
        queries.GET_USER_PROFILE,
        [userId]
    );

    return result.rows[0];
}

async function createCustomer(name, email, password){
    return await db.query(
        queries.CREATE_CUSTOMER,
        [name, email, password, "customer"]
    );
}

async function createAccount(account_number, cust_id, balance){
    return await db.query(
        accountQueries.CREATE_ACCOUNT,
        [account_number, cust_id, balance]
    );
}

module.exports = { getCustomerProfile, getUserProfile, createCustomer, createAccount, findUserByEmail };