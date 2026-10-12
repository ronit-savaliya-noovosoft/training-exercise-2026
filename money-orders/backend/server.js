require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

console.log(db);

const app = express();

app.use(express.json());

app.get("/api/health", async (req, res)=>{

    try{
        const result = await db.query(
          `SELECT current_database() AS database`
        );

        res.json({
            message: "Backend Connected to PostgreSQL",
            database: result.rows[0].database
        })
    }
    catch (e){
        console.log(e);
        console.log(e.message);
        console.log(e.errors);

        res.status(500).json({
            message: "Database connection failed"
        })
    }
});

app.post("/api/auth/login", async (req, res)=>{
   try{
       const { email, password } = req.body;

       if(!email || !password){
           return res.status(400).json({
               message: "Email and password are required"
           });
       }

       const result = await db.query(
           `SELECT * FROM USERS WHERE email = $1`, [email]
       );

       if(result.rows.length === 0){
            return res.status(401).json({
                message: "Invalid email or password"
            });
       }

       const user = result.rows[0];

       const passwordMatch = await bcrypt.compare(password, user.password);

       if(!passwordMatch){
           return res.status(401).json({
               message: "Invalid email or password"
           })
       }

       const token = jwt.sign({
           id: user.id,
           name: user.name,
           email: user.email,
           role: user.role
       },
           process.env.JWT_SECRET,
           {
               expiresIn: "1h"
           });

       res.json({
           message: "Login successful",
           token: token,
           user: {
               id: user.id,
               name: user.name,
               email: user.email,
               role: user.role
           }
       })
   }
   catch (e){
       console.error(e);

       res.status(500).json({
          message: "Server error"
       });
   }
});

app.get("/api/users/customers", async (req, res)=>{

});

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});