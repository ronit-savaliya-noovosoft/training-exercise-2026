const accountRepository = require("../repositories/account.repository");

async function getCustomerAccounts(){
    return accountRepository.getCustomerAccounts();
}

module.exports = { getCustomerAccounts };