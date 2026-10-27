const express= require('express');
const jobController = require("../controllers/job.controller");
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');

const router= express.Router();

router.get("/", authenticateToken, authorizeRole("admin"), jobController.getJobHistory);

module.exports = router;