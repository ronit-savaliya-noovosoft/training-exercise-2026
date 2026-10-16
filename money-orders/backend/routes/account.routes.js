const express= require('express');
const authenticateToken = require('../middlewares/auth.middleware');
const db = require("../config/db");
const accountController = require("../controllers/account.controller");

const router= express.Router();

router.get("/customers", authenticateToken, accountController.getCustomerAccounts);

// router.get("/customers", authenticateToken, async (req, res)=>{
//     try{
//         let filter, params;
//         const { id, role } = req.user;
//
//         if(role === 'manager'){
//             filter = "";
//             params = [];
//         }
//         else{
//             filter = "AND a.id <> $1";
//             params = [Number(id)];
//         }
//
//
//         const result = await db.query(
//             `SELECT u.id as customer_id, u.name, a.id as account_id, a.account_number, a.balance
//             FROM USERS u
//             JOIN ACCOUNTS a
//             ON u.id = a.cust_id
//             WHERE role='customer' ${filter}
//             ORDER BY u.name`, params
//         );
//
//         res.json({
//             message: "Accounts fetched successfully",
//             accounts: result.rows
//         });
//     }
//     catch (e){
//         res.status(500).json({
//             message: "Server Error",
//             error: e
//         })
//     }
// });

module.exports = router;