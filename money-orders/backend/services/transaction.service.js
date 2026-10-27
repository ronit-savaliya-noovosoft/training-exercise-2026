const db = require("../config/db");
const accountRepository = require("../repositories/account.repository");
const transactionRepository = require("../repositories/transaction.repository");
const jobsRepository = require("../worker/repositories/jobs.repository");
const {
    TRANSACTION_TYPE,
    TRANSACTION_STATUS
} = require("../constants/transactions.constants");

const transporter = require("../config/email");
const {JOB_TYPE} = require("../worker/constants/jobs.constants");

function createError(message, statusCode, code) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;

    return error;
}

function validateAmount(amount){
    const value = Number(amount);
    console.log(value);
    if(!Number.isFinite(value) || value <=0){
        throw createError("Invalid account or amount", 400, "INVALID_AMOUNT");
    }

    return value;
}

function validateAccountId(id){
    const value = Number(id);
    console.log(value);
    if(!Number.isInteger(value) || value <= 0){
        throw createError("Invalid account or amount", 400, "INVALID_ACCOUNT");
    }
    return value;
}

async function recordFailedTransaction(transaction){
    try{
        await transactionRepository.createTransactions(db, {
            ...transaction,
            status: TRANSACTION_STATUS.FAILED
        });
    }
    catch (e) {
        console.log(e);
    }
}

async function getHistory(user, query){
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    // const limit = Math.min(10, Math.max(1, parseInt(req.query.limit, 10) || 1));
    const limit = Math.max(10, parseInt(query.limit) || 1);
    const offset = (page-1) * limit;

    const { transactions, total } = await transactionRepository.getTransactionHistory(user, { limit, offset });

    return {
        status: "success",
        transactions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total/limit)
        }
    }
}

async function getAccount(user){
    if(user.role === 'manager'){
        return null;
    }

    return await transactionRepository.getAccountByCustomerId(user.id);
}

async function createPendingTransaction(transaction){
    const client = await db.connect();

    try{
        await client.query("BEGIN");

        const createdTransaction = await transactionRepository.createTransactions(client, {
            ...transaction,
            status: TRANSACTION_STATUS.PENDING
        });

        await jobsRepository.createJob(client, transaction.type, {
            transactionId: createdTransaction.id
        });

        await client.query("COMMIT");

        return createdTransaction;
    }
    catch (e) {
        await client.query("ROLLBACK");
        throw e;
    }
    finally {
        client.release();
    }
}

async function deposit({ accountId, amount, createdBy }){
    const id = validateAccountId(accountId);
    const value = validateAmount(amount);

    const transaction = {
        type: TRANSACTION_TYPE.DEPOSIT,
        fromAccountId: null,
        toAccountId: id,
        amount: value,
        createdBy
    }

    try{
        await createPendingTransaction(transaction);
        return { status: "success", message: "Deposit request submitted successfully" };
    }
    catch (e){
        await recordFailedTransaction(transaction);
        return { status: "failed", message: "Deposit request failed" };
    }
}

async function withdrawal({ accountId, amount, createdBy }){
    const id = validateAccountId(accountId);
    const value = validateAmount(amount);

    const transaction = {
        type: TRANSACTION_TYPE.WITHDRAWAL,
        fromAccountId: id,
        toAccountId: null,
        amount: value,
        createdBy
    }

    try{
        await createPendingTransaction(transaction);
        return { status: "success", message: "Withdraw request submitted successfully" };
    }
    catch (e){
        await recordFailedTransaction(transaction);
        return { status: "failed", message: "Withdraw request failed" };
    }
}

async function transfer({ fromAccountId, toAccountId, amount, createdBy }){
    const fromId = validateAccountId(fromAccountId);
    const toId = validateAccountId(toAccountId);
    const value = validateAmount(amount);

    if (fromId === toId){
        throw createError("Accounts must be different", 400, "SAME_ACCOUNT_TRANSFER")
    }

    const transaction = {
        type: TRANSACTION_TYPE.TRANSFER,
        fromAccountId: fromId,
        toAccountId: toId,
        amount: value,
        createdBy
    };

    try{
        await createPendingTransaction(transaction);
        return { status: "success", message: "Transfer request submitted successfully" };
    }
    catch (e){
        await recordFailedTransaction(transaction);
        return { status: "failed", message: "Transfer request failed" };
    }
}

async function emailTransactionHistory(user, filters){
    const { limit=10, type, fromDate, toDate } = filters;

    const allowedTypes = Object.values(TRANSACTION_TYPE);

    if(type && type!=="all" && !allowedTypes.includes(type.toLowerCase())){
        throw createError("Invalid transaction type", 400, "INVALID_TRANSACTION_TYPE");
    }
    
    const jobData = {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        filters: {
            limit: limit,
            type: type || "all",
            fromDate: fromDate || null,
            toDate: toDate || null
        }
    };

    const client = await db.connect();
    try{
        await client.query("BEGIN");

        await jobsRepository.createJob(client, JOB_TYPE.MAIL, jobData);

        await client.query("COMMIT");

        return {
            status: "success",
            message: "Transaction history email queued successfully"
        }
    }
    catch (e){
        await client.query("ROLLBACK");
        throw e;
    }
    finally {
        client.release();
    }

}


module.exports = {
    getHistory,
    getAccount,
    deposit,
    withdrawal,
    transfer,
    emailTransactionHistory
};