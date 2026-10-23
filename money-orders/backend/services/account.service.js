const accountRepository = require("../repositories/account.repository");
const bcrypt = require("bcrypt");

async function getCustomerAccounts(){
    return await accountRepository.getCustomerAccounts();
}

async function getAccountBalance(custId, password){
    const account = await accountRepository.getAccountBalance(custId);
    console.log(account);

    const passwordMatch = await bcrypt.compare(password, account.password);

    if(!passwordMatch){
        console.log("Password does not match");
        return null;
    }

    return account;
}

module.exports = { getCustomerAccounts, getAccountBalance };