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

async function getCustomerProfile(userId, accountId){
    const result = await db.query(
        queries.GET_CUSTOMER_PROFILE,
        [userId, accountId]
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

async function createCustomer(client, name, email, password){
    return await client.query(
        queries.CREATE_CUSTOMER,
        [name, email, password, "customer"]
    );
}

async function checkEmail(email){
    const result = await db.query(
        queries.CHECK_EMAIL,
        [email]
    );

    return result.rowCount;
}

module.exports = {
    getCustomerProfile,
    getUserProfile,
    createCustomer,
    findUserByEmail,
    checkEmail,
};