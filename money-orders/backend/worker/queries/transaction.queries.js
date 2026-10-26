const GET_PENDING_TRANSACTION_IDS = `
    SELECT id
    FROM TRANSACTIONS
    WHERE status = 'pending'
    ORDER BY created_at ASC
    LIMIT $1
`;

const GET_TRANSACTION_FOR_UPDATE = `
    SELECT
        id,
        type,
        from_account_id,
        to_account_id,
        amount
    FROM TRANSACTIONS
    WHERE status = 'pending'
        AND id = $1
    FOR UPDATE
`;

const GET_NEXT_PENDING_TRANSACTION = `
    SELECT
        id,
        type,
        from_account_id,
        to_account_id,
        amount
    FROM TRANSACTIONS 
    WHERE status = 'pending'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
`;

const GET_ACCOUNTS_FOR_UPDATE = `
    SELECT 
        id, 
        balance
    FROM ACCOUNTS
    WHERE id = ANY($1)
    FOR UPDATE
`;

const DEPOSIT_AMOUNT = `
    UPDATE ACCOUNTS
    SET balance = balance + $1
    WHERE id = $2
    RETURNING id, balance
`;

const WITHDRAW_AMOUNT =  `
    UPDATE ACCOUNTS
    SET balance = balance - $1
    WHERE id = $2 
    AND balance >= $1
`;

const MARK_TRANSACTION_COMPLETED = `
    UPDATE TRANSACTIONS
    SET status = 'completed'
    WHERE id = $1
`;

const MARK_TRANSACTION_FAILED = `
    UPDATE TRANSACTIONS
    SET status = 'failed'
    WHERE id = $1
`;

module.exports = {
    GET_PENDING_TRANSACTION_IDS,
    GET_TRANSACTION_FOR_UPDATE,
    GET_NEXT_PENDING_TRANSACTION,
    GET_ACCOUNTS_FOR_UPDATE,
    DEPOSIT_AMOUNT,
    WITHDRAW_AMOUNT,
    MARK_TRANSACTION_COMPLETED,
    MARK_TRANSACTION_FAILED
}