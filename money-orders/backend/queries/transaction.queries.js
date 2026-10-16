const INSERT_TRANSACTION = `
    INSERT INTO transactions (
        type, from_account_id, to_account_id, amount ,status, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, type, from_account_id, to_account_id, amount ,status, created_by
`;

const TRANSACTION_JOINS = `
    FROM TRANSACTIONS t
    LEFT JOIN ACCOUNTS fa
              ON t.from_account_id=fa.id
    LEFT JOIN USERS sender
              ON fa.cust_id=sender.id
    LEFT JOIN ACCOUNTS ta
              ON t.to_account_id=ta.id
    LEFT JOIN USERS receiver
              ON receiver.id=ta.cust_id
`;

const COUNT_TRANSACTIONS_PREFIX = `SELECT COUNT(*) AS total ${TRANSACTION_JOINS} WHERE `;

const GET_TRANSACTION_HISTORY_PREFIX = `
    SELECT 
        t.id,
        t.type, 
        sender.name as sender, 
        fa.account_number as from_account_number, 
        receiver.name as receiver, 
        ta.account_number as to_account_number, 
        t.amount, 
        t.status, 
        t.created_at
    ${TRANSACTION_JOINS}
    WHERE
`;

const GET_TRANSACTIONS_FOR_EMAIL = `
    ${GET_TRANSACTION_HISTORY_PREFIX}
        ($2::text IS NULL OR LOWER(t.type) = LOWER($2))
    AND ($3::date IS NULL OR t.created_at >= $3::date)
    AND ($4::date IS NULL OR t.created_at <= $4::date)
    ORDER BY t.created_at DESC 
    LIMIT $5
`;

module.exports = {
    INSERT_TRANSACTION,
    COUNT_TRANSACTIONS_PREFIX,
    GET_TRANSACTION_HISTORY_PREFIX,
    GET_TRANSACTIONS_FOR_EMAIL
}