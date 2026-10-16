const express= require('express');
const authenticateToken = require('../middlewares/auth.middleware');
const transactionController = require("../controllers/transaction.controller");

const router= express.Router();

router.get("/", authenticateToken, transactionController.getHistory);
router.post("/deposit", authenticateToken, transactionController.deposit);
router.post("/withdrawal", authenticateToken, transactionController.withdrawal);
router.post("/transfer", authenticateToken, transactionController.transfer);
router.post("/email-history", authenticateToken, transactionController.emailHistory);

module.exports = router;
