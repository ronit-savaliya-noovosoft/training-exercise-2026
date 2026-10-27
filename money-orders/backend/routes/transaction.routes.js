const express= require('express');
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');
const transactionController = require("../controllers/transaction.controller");

const router= express.Router();

router.get("/", authenticateToken, transactionController.getHistory);
router.post("/deposit", authenticateToken, authorizeRole("customer", "manager"), transactionController.deposit);
router.post("/withdrawal", authenticateToken, authorizeRole("customer", "manager"), transactionController.withdrawal);
router.post("/transfer", authenticateToken, authorizeRole("customer", "manager"), transactionController.transfer);
router.post("/email-history", authenticateToken, authorizeRole("customer"), transactionController.emailHistory);

module.exports = router;
