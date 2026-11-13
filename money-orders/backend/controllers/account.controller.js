const accountService = require("../services/account.service");
const jobService = require("../services/job.service");

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
        const result = await accountService.getAccountBalance(req.user, req.body.password);

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

async function getMyAccounts(req, res, next){
    try{
        const accounts = await accountService.getMyAccounts(req.user);

        return res.status(200).json({
           status: "success",
           message: "Accounts fetched successfully",
           accounts
        });
    }
    catch (e) {
        next(e);
    }
}

async function selectAccount(req, res, next){
    try {
        const { accountId } = req.body;

        if(!accountId){
            return res.status(400).json({
                status: "failed",
                message: "Account ID is required"
            });
        }

        const result = await accountService.selectAccount(req.user, accountId);

        res.cookie("token", result.token, {
           httpOnly: true,
           sameSite: "strict",
           maxAge: 24*60*60*1000
        });

        return res.status(200).json({
            status: result.status,
            message: result.message,
            account: result.account
        });
    }
    catch (e) {
        next(e);
    }
}

async function createAccount(req, res){
    try{
        const result = await accountService.createAccount(
            req.user
        );

        return res.status(200).json({
            status: "success",
            message: "account created successfully",
            result
        });
    }
    catch (e){
        return res.status(500).json({
            message: "Failed to create an account"
        });
    }
}

async function deactivateAccount(req, res){
    try{
        const { accountId } = req.body;

        await accountService.deactivateAccount(
            accountId
        );

        return res.status(200).json({
            status: "success",
            message: "account deactivated successfully",
        });
    }
    catch (e){
        return res.status(500).json({
            message: "Failed to deactivate an account"
        });
    }
}

async function getAllAccounts(req, res){
    try{
        const result = await accountService.getAllAccounts(req.query);

        console.log(result);

        return res.json(result);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message
        });
    }
}

module.exports = {
    getCustomerAccounts,
    getAccountBalance,
    getBalanceOfSelectedCustomer,
    getMyAccounts,
    selectAccount,
    createAccount,
    deactivateAccount,
    getAllAccounts
};