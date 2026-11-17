const express= require('express');
const authenticateToken = require('../middlewares/auth.middleware');
const accountController = require("../controllers/account.controller");
const authorizeRole = require("../middlewares/role.middleware");

const router= express.Router();

router.get("/customers", authenticateToken, authorizeRole("customer", "manager"), accountController.getCustomerAccounts);
router.post("/verify-balance", authenticateToken, authorizeRole("customer"), accountController.getAccountBalance);
router.post("/get-balance", authenticateToken, authorizeRole("customer", "manager"), accountController.getBalanceOfSelectedCustomer);
router.get("/my-accounts", authenticateToken, authorizeRole("customer"), accountController.getMyAccounts);
router.post("/select", authenticateToken, authorizeRole("customer"), accountController.selectAccount);
router.post("/create-account", authenticateToken, authorizeRole("manager"), accountController.createAccount);
router.post("/deactivate-account", authenticateToken, authorizeRole("customer", "manager"), accountController.deactivateAccount);
router.get("/all-accounts", authenticateToken, authorizeRole("manager"), accountController.getAllAccounts);
router.post("/account-creation-request", authenticateToken, authorizeRole("customer"), accountController.createRequestForAccountCreation);
router.get("/get-pending-account-requests", authenticateToken, authorizeRole("manager"), accountController.getPendingAccountRequests)
router.post("/cancel-request", authenticateToken, authorizeRole("manager"), accountController.cancelRequest);
router.get("/get-requests", authenticateToken, authorizeRole("customer"), accountController.getRequestsByUserId)

module.exports = router;