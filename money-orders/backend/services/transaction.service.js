const db = require("../config/db");
const accountRepository = require("../repositories/account.repository");
const transactionRepository = require("../repositories/transaction.repository");
const {
    TRANSACTION_TYPE,
    TRANSACTION_STATUS
} = require("../constants/transactions.constants");

const transporter = require("../config/email");

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

async function deposit({ accountId, amount, createdBy }){
    const id = validateAccountId(accountId);
    const value = validateAmount(amount);

    const client = await db.connect();

    const transaction = {
        type: TRANSACTION_TYPE.DEPOSIT,
        fromAccountId: null,
        toAccountId: id,
        amount: value,
        createdBy
    }

    try{

        await transactionRepository.createTransactions(client, {
            ...transaction,
            status: TRANSACTION_STATUS.PENDING
        });


        return { status: "success", message: "Deposit Successfully" };
    }
    catch (e){

        await recordFailedTransaction(transaction);
        return { status: "failed", message: "Deposit Failed" };
    }
    finally {
        client.release();
    }
}

async function withdrawal({ accountId, amount, createdBy }){
    const id = validateAccountId(accountId);
    const value = validateAmount(amount);

    const client = await db.connect();

    const transaction = {
        type: TRANSACTION_TYPE.WITHDRAWAL,
        fromAccountId: id,
        toAccountId: null,
        amount: value,
        createdBy
    }


    try{
        await transactionRepository.createTransactions(client,{
            ...transaction,
            status: TRANSACTION_STATUS.PENDING
        }) ;

        return { status: "success", message: "Withdrawal Successfully" };
    }
    catch (e){
        await recordFailedTransaction(transaction);

        return { status: "failed", message: "Withdrawal Failed" };
    }
    finally {
        client.release();
    }
}

async function transfer({ fromAccountId, toAccountId, amount, createdBy }){
    const fromId = validateAccountId(fromAccountId);
    const toId = validateAccountId(toAccountId);
    const value = validateAmount(amount);

    if (fromId === toId){
        throw createError("Accounts must be different", 400, "SAME_ACCOUNT_TRANSFER")
    }

    const client = await db.connect();
    const transaction = {
        type: TRANSACTION_TYPE.TRANSFER,
        fromAccountId: fromId,
        toAccountId: toId,
        amount: value,
        createdBy
    };


    try{
        await transactionRepository.createTransactions(client, {
            ...transaction,
            status: TRANSACTION_STATUS.PENDING
        });


        return { status: "success", message: "Transfer Successfully" };
    }
    catch (e){
        await recordFailedTransaction(transaction);

        return { status: "failed", message: "Transfer Failed" };
    }
    finally {
        client.release();
    }
}

async function emailTransactionHistory(user, filters){
    const { limit=10, type, fromDate, toDate } = filters;

    const allowedTypes = ["deposit", "withdraw", "transfer"];

    if(type && type!=="all" && !allowedTypes.includes(type.toLowerCase())){
        console.error("Invalid transaction type");
        return;
    }

    const transactions = await transactionRepository.getTransactionsForEmail(
        user.id,
        !type || type === "all" ? null : type,
        fromDate || null,
        toDate || null,
        limit
    );

    const rows = transactions.map((transaction)=>
    `
        <tr>
            <td>${transaction.id}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.sender}</td>
            <td>${transaction.receiver}</td>
            <td>${new Date(transaction.created_at).toLocaleString()}</td>
        </tr>
    `
    ).join("");

    let html;
    if (transactions.length === 0){
        html = `<h3>No Transaction found for selected filter</h3>`;
        console.error("No Transaction found for selected filter");
    }
    else {
        html = `
            <h2>Your Transaction History</h2>
            <p>Hello! ${user.name},</p>
            <p>Here are you latest transactions matching your selected filter.</p>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>From Account</th>
                        <th>To Account</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            <p>Records included: ${transactions.length}</p>
        `;
    }

    await transporter.sendMail({
        from: '"Banking App" <banking-app@localhost>',
        to: user.email,
        subject: "Your Transaction History",
        html: html
    });

    return {
        status: "success",
        message: "Transaction History sent successfully",
        recordSent: transactions.length
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