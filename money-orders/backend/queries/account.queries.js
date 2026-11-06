const UPDATE_BALANCE = `
    UPDATE accounts
    SET balance = balance + $1
    WHERE id = $2
`;

const GET_ACCOUNT_FOR_UPDATE = `
    SELECT id, balance
    FROM accounts 
    WHERE id = $1
    FOR UPDATE 
`;

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

module.exports = {
    UPDATE_BALANCE,
    GET_ACCOUNT_FOR_UPDATE,
    CREATE_ACCOUNT,
    GET_CUSTOMER_ACCOUNTS,
    GET_ACCOUNT_BALANCE,
    GET_ACCOUNT_BALANCE_BY_ACCOUNT_ID,
    GET_ACCOUNT_DETAILS,
    GET_ACCOUNTS_OF_CUSTOMER,
    GET_ACCOUNT_OF_CUSTOMER,
    GET_LAST_ACCOUNT_NO
};