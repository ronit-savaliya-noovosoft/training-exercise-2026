const accountService = require("../services/account.service");

async function getCustomerAccounts(req, res){
    try{
        const accounts = await accountService.getCustomerAccounts();

        return res.json({
            message: "Accounts fetched successfully",
            accounts
        });
    }
    catch (e){
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = { getCustomerAccounts };