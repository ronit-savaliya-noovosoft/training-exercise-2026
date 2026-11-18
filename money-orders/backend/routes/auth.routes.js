const express= require('express');
const authenticateToken = require('../middlewares/auth.middleware')
const authController = require("../controllers/auth.controller");
const authorizeRole = require('../middlewares/role.middleware');

const router= express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.get("/me", authenticateToken, authorizeRole("customer", "manager", "admin"), authController.getMe);

module.exports = router;