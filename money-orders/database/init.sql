CREATE TABLE USERS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL CHECK ( role IN ('customer', 'manager') )
);

CREATE TABLE ACCOUNTS (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    cust_id INT REFERENCES USERS(id),
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TRANSACTIONS (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL CHECK ( type IN ('deposit', 'withdraw', 'transfer') ),
    from_account_id INT REFERENCES ACCOUNTS(id),
    to_account_id INT REFERENCES ACCOUNTS(id),
    amount DECIMAL(10, 2),
    status VARCHAR(255) NOT NULL CHECK ( status IN ('pending', 'in_process', 'failed', 'completed') ),
    created_by INT REFERENCES USERS(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO accounts (account_number, cust_id, balance)
VALUES ('4321 8765 0987 6545', 3, 5000);

SELECT u.id, u.name, a.id, a.account_number, a.balance FROM USERS u
JOIN ACCOUNTS a
ON u.id = a.cust_id
WHERE role='customer';

SELECT t.id, t.type, sender.name as sender, fa.account_number as from_account_number, receiver.name as receiver, ta.account_number as to_account_number, t.amount, t.status, t.created_at
FROM TRANSACTIONS t
         LEFT JOIN ACCOUNTS fa
                   ON t.from_account_id=fa.id
         LEFT JOIN USERS sender
                   ON fa.cust_id=sender.id
         LEFT JOIN ACCOUNTS ta
                   ON t.to_account_id=ta.id
         LEFT JOIN USERS receiver
                   ON receiver.id=ta.cust_id
WHERE sender.id = 2 OR receiver.id = 2
ORDER BY t.created_at DESC;

SELECT u.name, u.email, a.id, a.balance, a.account_number, u.role
FROM USERS u
JOIN ACCOUNTS a
ON a.cust_id = u.id
WHERE u.id = 1;

SELECT * FROM TRANSACTIONS;
SELECT * FROM ACCOUNTS;
SELECT * FROM USERS;

SELECT CURRENT_TIMESTAMP;

SELECT current_database() AS database;
DROP TABLE transactions;
DROP TABLE accounts;
DROP TABLE users;
