const TRANSACTION_TYPE = Object.freeze({
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdraw",
    TRANSFER: "transfer"
})

const TRANSACTION_STATUS = Object.freeze({
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed"
});

module.exports = { TRANSACTION_STATUS, TRANSACTION_TYPE };