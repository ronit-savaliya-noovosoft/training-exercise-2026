require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/db");
const transactionRoutes = require("./routes/transaction.routes");
const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");

const app = express();

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", async (req, res)=> {

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

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/accounts", accountRoutes);

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});