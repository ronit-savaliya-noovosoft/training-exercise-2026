const transactionService = require("../services/transaction.service");

function sendError(res, error, fallbackFunction){
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
       message: statusCode === 500 ? fallbackFunction : error.message
    });
}

async function getHistory(req, res){
    try{
        return res.json(await transactionService.getHistory(req.user, req.query));
    }
    catch (e) {
        console.log(e);
        return sendError(res, e, "Failed to Fetch");
    }
}

async function deposit(req, res){
    try{
        return res.json(await transactionService.deposit({
            accountId: req.body.accountId,
            amount: req.body.amount,
            createdBy: req.user.id
        }))
    }
    catch (e){
        return sendError(res, e, "Deposit Failed");
    }
}

async function withdrawal(req, res){
    try{
        return res.json(await transactionService.withdrawal({
            accountId: req.body.accountId,
            amount: req.body.amount,
            createdBy: req.user.id
        }))
    }
    catch (e){
        return sendError(res, e, "Withdrawal Failed");
    }
}

async function transfer(req, res){
    try{
        return res.json(await transactionService.transfer({
            fromAccountId: req.body.fromAccountId,
            toAccountId: req.body.toAccountId,
            amount: req.body.amount,
            createdBy: req.user.id
        }))
    }
    catch (e){
        return sendError(res, e, "Transfer Failed");
    }
}

async function emailHistory(req, res){
    try{
        const result = await transactionService.emailTransactionHistory(
            req.user,
            req.body
        );

        return res.json(result);
    }
    catch (e){
        console.error(e);

        return res.status(500).json({
            message: "Failed to email transaction History"
        });
    }
}

module.exports = { getHistory, deposit, withdrawal, transfer, emailHistory };