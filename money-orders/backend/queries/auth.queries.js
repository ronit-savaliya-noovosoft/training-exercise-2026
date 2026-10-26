const LOGIN_USER = `
    SELECT *
    FROM USERS
    WHERE email = $1
`;

const CREATE_CUSTOMER = `
    INSERT INTO USERS (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id
`;

const GET_CUSTOMER_PROFILE = `
    SELECT
        u.name,
        u.email,
        a.id as account_id,
        a.balance,
        a.account_number,
        u.role
    FROM USERS u
    JOIN ACCOUNTS a
    ON a.cust_id = u.id
    WHERE u.id = $1
`;

const GET_USER_PROFILE = `
    SELECT 
        u.name,
        u.email,
        u.role
    FROM USERS u
    WHERE u.id = $1
`;

const CHECK_EMAIL = `
    SELECT 1 
    FROM users 
    WHERE email = $1
    LIMIT 1
`;

module.exports = { LOGIN_USER, CREATE_CUSTOMER, GET_CUSTOMER_PROFILE, GET_USER_PROFILE, CHECK_EMAIL };