const db = require("../config/db");
const queries = require("../queries/auth.queries");
const accountQueries = require("../queries/account.queries");

async function findUserByEmail(email){
    const result = await db.query(
        queries.LOGIN_USER,
        [email]
    );

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

async function deleteOldResetToken(userId){
    return await db.query(
        queries.DELETE_OLD_REST_TOKEN,
        [userId]
    );
}

async function createPasswordResetToken(userId, tokenHash){
    const result = await db.query(
        queries.INSERT_RESET_TOKEN,
        [userId, tokenHash]
    );

    return result.rows[0];
}

async function getValidResetToken(client, tokenHash){
    const result = await client.query(
        queries.GET_VALID_RESET_TOKEN,
        [tokenHash]
    );

    return result.rows[0];
}

async function updateUserPassword(client, userId, password){
    return await client.query(
        queries.UPDATE_USER_PASSWORD,
        [password, userId]
    );
}

async function markResetTokenUsed(client, tokenId){
    return await client.query(
        queries.MARK_RESET_TOKEN_USED,
        [tokenId]
    );
}

module.exports = {
    getCustomerProfile,
    getUserProfile,
    createCustomer,
    findUserByEmail,
    checkEmail,
    deleteOldResetToken,
    createPasswordResetToken,
    getValidResetToken,
    updateUserPassword,
    markResetTokenUsed
};