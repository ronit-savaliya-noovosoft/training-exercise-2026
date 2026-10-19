const express= require('express');
const authenticateToken = require('../middlewares/auth.middleware');
const db = require("../config/db");
const accountController = require("../controllers/account.controller");

const router= express.Router();

router.get("/customers", authenticateToken, accountController.getCustomerAccounts);


module.exports = router;