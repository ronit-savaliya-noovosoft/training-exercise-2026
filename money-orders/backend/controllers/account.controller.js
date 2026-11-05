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

async function getAccountBalance(req, res){
    try{
        const result = await accountService.getAccountBalance(req.user.id, req.body.password);

        return res.json({
            message: "Balance fetched successfully",
            balance: result.balance
        });
    }
    catch (e){
        return res.status(500).json({
            message: e.message
        });
    }
}

async function getBalanceOfSelectedCustomer(req, res){
    try{
        const result = await accountService.getBalanceOfSelectedCustomer(req.body.id);

        console.log(result);

        return res.json({
            message: "Balance fetched successfully",
            balance: result.balance
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
}

module.exports = {
    getCustomerAccounts,
    getAccountBalance,
    getBalanceOfSelectedCustomer
};