const accountRepository = require("../repositories/account.repository");
const bcrypt = require("bcrypt");

async function getCustomerAccounts(){
    return await accountRepository.getCustomerAccounts();
}

async function getAccountBalance(custId, password){
    const account = await accountRepository.getAccountBalance(custId);
    console.log(account);

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

module.exports = { getCustomerAccounts, getAccountBalance };