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

module.exports = { UPDATE_BALANCE, GET_ACCOUNT_FOR_UPDATE, CREATE_ACCOUNT, GET_CUSTOMER_ACCOUNTS };