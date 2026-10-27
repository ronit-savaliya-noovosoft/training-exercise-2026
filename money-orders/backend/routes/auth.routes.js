const express= require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authenticateToken = require('../middlewares/auth.middleware')
const db = require("../config/db");
const authController = require("../controllers/auth.controller");
const authorizeRole = require('../middlewares/role.middleware');

const router= express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.get("/me", authenticateToken, authorizeRole("customer", "manager", "admin"), authController.getMe);

module.exports = router;