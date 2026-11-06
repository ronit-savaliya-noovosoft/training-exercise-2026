const accountRepository = require("../repositories/account.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

async function createAccount(user){
    try{
        const lastAccountNo = await accountRepository.getLastAccountNumber();
        const newAccountNo = Number(lastAccountNo.replaceAll(" ", ""))+1;

        const accountNumber = newAccountNo.toString().replace(/(.{4})/g, '$1 ').trim();
        await accountRepository.createAccount(accountNumber, user.id, 0);
    }
    catch (e) {
        throw e;
    }
}

module.exports = {
    getCustomerAccounts,
    getAccountBalance,
    getBalanceOfSelectedCustomer,
    getMyAccounts,
    selectAccount,
    createAccount
};