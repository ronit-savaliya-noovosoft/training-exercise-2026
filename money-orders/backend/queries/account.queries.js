const CREATE_ACCOUNT = `
    INSERT INTO ACCOUNTS (account_number, cust_id, balance)
    VALUES ($1, $2, $3)   
`;

const GET_CUSTOMER_ACCOUNTS = `
    SELECT u.id as customer_id, u.name, a.id as account_id, a.account_number, a.balance
    FROM USERS u
             JOIN ACCOUNTS a
                  ON u.id = a.cust_id
    WHERE role='customer'
    AND a.is_active = true
    ORDER BY u.name
`;

// For customer that they can verify their balance
const GET_ACCOUNT_BALANCE = `
    SELECT a.id, a.balance, u.password
    FROM accounts a
    JOIN users u 
    ON u.id=a.cust_id
    WHERE cust_id=$1
    AND a.id=$2
`;

const GET_ACCOUNT_DETAILS = `
    SELECT a.id as id, a.account_number, u.name 
    FROM accounts a
    JOIN users u 
    ON u.id=a.cust_id
    WHERE a.id=ANY($1)
`;

// For Manager to see the balance and also for ensure sufficient balance
const GET_ACCOUNT_BALANCE_BY_ACCOUNT_ID = `
    SELECT a.id, a.balance
    FROM accounts a 
    WHERE a.id=$1
`;

const GET_ACCOUNTS_OF_CUSTOMER = `
    SELECT a.id as id, u.name, u.email, a.account_number, a.balance
    FROM accounts a 
    JOIN users u 
    ON u.id=a.cust_id
    WHERE u.id = $1
    AND a.is_active = true
`;

const GET_ACCOUNT_OF_CUSTOMER = `
    SELECT id, account_number, balance
    FROM accounts
    WHERE id = $1 AND cust_id = $2
`;

const GET_LAST_ACCOUNT_NO = `
    SELECT MAX(account_number)
    FROM ACCOUNTS    
`;

const DEACTIVATE_ACCOUNT = `
    UPDATE ACCOUNTS
    SET is_active = NOT is_active
    WHERE id = $1
`;

// All active and deactivate accounts
const GET_ALL_ACCOUNTS = `
    SELECT
        a.id AS id,
        a.account_number,
        a.balance,
        u.name,
        u.email,
        a.created_at,
        a.is_active,
        COUNT(*) OVER() AS total
    FROM ACCOUNTS a
             JOIN USERS u ON a.cust_id = u.id
    WHERE (
              $3::text IS NULL 
              OR a.account_number ILIKE '%' || $3 || '%'
              OR u.name ILIKE '%' || $3 || '%'
              OR u.email ILIKE '%' || $3 || '%'
              )
    ORDER BY a.created_at DESC
        LIMIT $1
    OFFSET $2
`;

const INSERT_REQUEST_FOR_ACCOUNT_CREATION = `
    INSERT INTO REQUESTS (type, data)
    VALUES ('account', $1)
    RETURNING *
`;

const GET_PENDING_ACCOUNT_REQUESTS = `
    SELECT id, data
    FROM REQUESTS
    WHERE status = 'pending'
`;

const UPDATE_REQUEST_STATUS_APPROVED = `
    UPDATE REQUESTS
    SET status = 'approved'
    WHERE id = $1
`;

const UPDATE_REQUEST_STATUS_CANCELLED = `
    UPDATE REQUESTS
    SET status = 'cancelled'
    WHERE id = $1
`;

module.exports = {
    CREATE_ACCOUNT,
    GET_CUSTOMER_ACCOUNTS,
    GET_ACCOUNT_BALANCE,
    GET_ACCOUNT_BALANCE_BY_ACCOUNT_ID,
    GET_ACCOUNT_DETAILS,
    GET_ACCOUNTS_OF_CUSTOMER,
    GET_ACCOUNT_OF_CUSTOMER,
    GET_LAST_ACCOUNT_NO,
    DEACTIVATE_ACCOUNT,
    GET_ALL_ACCOUNTS,
    INSERT_REQUEST_FOR_ACCOUNT_CREATION,
    GET_PENDING_ACCOUNT_REQUESTS,
    UPDATE_REQUEST_STATUS_APPROVED,
    UPDATE_REQUEST_STATUS_CANCELLED
};