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
    AND a.id = $2
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

const DELETE_OLD_REST_TOKEN = `
    DELETE FROM password_reset_tokens
    WHERE user_id = $1 AND used_at IS NULL
`;

const INSERT_RESET_TOKEN = `
    INSERT INTO password_reset_tokens ( user_id, token_hash, expires_at )
    VALUES ($1, $2, NOW() + INTERVAL '15 minutes')
    RETURNING id
`;

const GET_VALID_RESET_TOKEN = `
    SELECT id, user_id
    FROM password_reset_tokens
    WHERE token_hash = $1 
        AND expires_at > NOW()
        AND used_at IS NULL 
`;

const UPDATE_USER_PASSWORD = `
    UPDATE users
    SET password = $1
    WHERE id = $2
`;

const MARK_RESET_TOKEN_USED = `
    UPDATE password_reset_tokens
    SET used_at = NOW()
    WHERE id = $1
`;

module.exports = {
    LOGIN_USER,
    CREATE_CUSTOMER,
    GET_CUSTOMER_PROFILE,
    GET_USER_PROFILE,
    CHECK_EMAIL,
    DELETE_OLD_REST_TOKEN,
    INSERT_RESET_TOKEN,
    GET_VALID_RESET_TOKEN,
    UPDATE_USER_PASSWORD,
    MARK_RESET_TOKEN_USED
};