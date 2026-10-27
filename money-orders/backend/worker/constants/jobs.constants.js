const JOB_TYPE = Object.freeze({
    DEPOSIT: "deposit",
    WITHDRAWAL: "withdraw",
    TRANSFER: "transfer",
    MAIL: "mail"
})

const JOB_STATUS = Object.freeze({
    PENDING: "pending",
    IN_PROCESS: "in_process",
    COMPLETED: "completed",
    FAILED: "failed"
});

module.exports = { JOB_STATUS, JOB_TYPE };