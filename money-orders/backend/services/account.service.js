const accountRepository = require("../repositories/account.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const jobsRepository = require("../worker/repositories/jobs.repository");
const {JOB_TYPE} = require("../worker/constants/jobs.constants");

async function getCustomerAccounts(){
    return await accountRepository.getCustomerAccounts();
}

async function getAccountBalance(user, password){
    const account = await accountRepository.getAccountBalance(user.id, user.activeAccountId);

    try{
        const passwordMatch = await bcrypt.compare(password, account.password);

        if(!passwordMatch){
            console.log("Password does not match");
            throw new Error("Password does not match");
        }
    }
    catch (e){
        throw e;
    }


    return account;
}

async function getBalanceOfSelectedCustomer(accountId){
    return await accountRepository.getAccountBalanceByAccountId(accountId);
}

async function getMyAccounts(user){
    return await accountRepository.getMyAccounts(user.id);
}

async function selectAccount(user, accountId){
    const account = await accountRepository.getAccountByCustomer(accountId, user.id);

    if(!account){
        throw new Error("Account not found or unauthorized");
    }

    const token = jwt.sign({
       id: user.id,
       name: user.name,
       email: user.email,
       role: user.role,
       activeAccountId: account.id
    },
        process.env.JWT_SECRET,
    {expiresIn: "1d"});

    return {
        message: "Account selected successfully",
        status: "success",
        token,
        account
    };
}

async function createAccount(user, body){
    const client = await db.connect();
    const { userId, requestId } = body;

    try{
        await client.query("BEGIN");

        const lastAccountNo = await accountRepository.getLastAccountNumber();
        const newAccountNo = Number(lastAccountNo.replaceAll(" ", ""))+1;


        const accountNumber = newAccountNo.toString().replace(/(.{4})/g, '$1 ').trim();
        await accountRepository.createAccount(client, accountNumber, userId, 0);

        await accountRepository.markApproved(client, requestId);

        const jobData = {
            account: {
                holderId: userId,
                accountNumber: accountNumber,
                managerName: user.name,
                status: "approved"
            },
            type: "ACCOUNT"
        }

        await jobsRepository.createJob(client, JOB_TYPE.MAIL, jobData);

        await client.query("COMMIT");
    }
    catch (e) {
        await client.query("ROLLBACK");
        console.log(e.message);
        throw e;
    }
    finally {
        await client.release();
    }
}

async function deactivateAccount(accountId){
    return await accountRepository.deactivateAccount(accountId);
}

async function getAllAccounts(query){
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(10, parseInt(query.limit) || 1);
    const offset = (page-1) * limit;

    const accounts = await accountRepository.getAllAccounts(limit, offset, query.search) || [];
    // const total = await accountRepository.countAccounts();

    const total = Number(accounts[0]?.total ?? 0);

    return {
        status: "success",
        accounts,
        pagination: {
            page,
            limit,
            total,
            totalPages: (Math.ceil(total/limit))
        }
    }
}

async function createRequestForAccountCreation(user){
    try{
        const request = await accountRepository.createRequestForAccountCreation({
            userId: user.id,
            name: user.name,
            email: user.email
        });

        return {
            status: "success",
            message: "request for create account sent successfully",
            request
        }
    }
    catch (e) {
        throw e;
    }
}

async function getPendingAccountRequests(){
    return await accountRepository.getPendingAccountRequests();
}

async function cancelRequest(userId, requestId){
    const client = await db.connect();
    try{
        await client.query("BEGIN");
        const request = await accountRepository.markCancelled(client, requestId);

        console.log(userId);

        const jobData = {
            account: {
                holderId: userId,
                status: "cancelled"
            },
            type: "ACCOUNT"
        }

        await jobsRepository.createJob(client, JOB_TYPE.MAIL, jobData);

        await client.query("COMMIT");

        return request;
    }
    catch (e) {
        await client.query("ROLLBACK");
        console.log(e.message);
        throw e;
    }
    finally {
        await client.release();
    }
}

async function getRequestsByUserId(user){
    return await accountRepository.getRequestsByUserId(user.id);
}


module.exports = {
    getCustomerAccounts,
    getAccountBalance,
    getBalanceOfSelectedCustomer,
    getMyAccounts,
    selectAccount,
    createAccount,
    deactivateAccount,
    getAllAccounts,
    createRequestForAccountCreation,
    getPendingAccountRequests,
    cancelRequest,
    getRequestsByUserId
};