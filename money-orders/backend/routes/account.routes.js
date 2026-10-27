const express= require('express');
const authenticateToken = require('../middlewares/auth.middleware');
const db = require("../config/db");
const accountController = require("../controllers/account.controller");
const authorizeRole = require("../middlewares/role.middleware");

const router= express.Router();

router.get("/customers", authenticateToken, authorizeRole("customer", "manager"), accountController.getCustomerAccounts);
router.post("/verify-balance", authenticateToken, authorizeRole("customer"), accountController.getAccountBalance);


module.exports = router;