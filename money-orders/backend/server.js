require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");
const authenticateToken = require("./middleware");

// console.log(db);

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

app.post("/api/auth/login", async (req, res)=> {
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

       res.cookie("token", token, {
           httpOnly: true,
           sameSite: "strict",
           secure: false,
           maxAge: 60*60*1000,
           path: "/"
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
       });
   }
   catch (e){
       console.error(e);

       res.status(500).json({
          message: "Server error"
       });
   }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try{
        let result;
        if(req.user.role === 'customer'){
            result = await db.query(
                `SELECT u.name, u.email, a.id, a.balance, a.account_number, u.role
                    FROM USERS u
                    JOIN ACCOUNTS a
                    ON a.cust_id = u.id
                    WHERE u.id = $1`,
                    [req.user.id]
            );
        }
        else{
            result = await db.query(
                `SELECT u.name, u.email, u.role
                    FROM USERS u
                    WHERE u.id = $1`,
                [req.user.id]
            );
        }


        res.json({
            message: "User fetched successfully",
            user: result.rows[0]
        });
    }
    catch (e){
        res.status(500).json({
            message: "Server Error",
            error: e
        });
    }
});

app.post("/api/auth/signup", async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const client = await db.connect();

        await client.query(
                        `INSERT INTO USERS (name, email, password, role)
                        VALUES ($1, $2, $3, $4)`, [name, email, passwordHash, "customer"]);

        client.release();

        res.status(200).json({
            message: "Customer Sign Up successfully"
        });
    }
    catch (e){
        res.status(500).json({
           message: "Server Error",
           error: e
        });
    }
});

app.post("/api/auth/logout", async (req, res) => {
    res.clearCookie('token', {
       httpOnly: true,
       sameSite: 'strict',
       path: '/'
    });

    return res.status(200).json({
       message: "Logged out successfully"
    });
});

app.get("/api/transactions", authenticateToken, async (req, res) => {
    try{
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        // const limit = Math.min(10, Math.max(1, parseInt(req.query.limit, 10) || 1));
        const limit = Math.max(10, parseInt(req.query.limit) || 1);
        const offset = (page-1) * limit;

        let filter, params;
        const { id, role } = req.user;

        console.log("Checkpoint 1");

        if(role === 'manager'){
           filter = "t.created_by = $1";
           params = [id];
        }
        else{
            filter = "sender.id = $1 OR receiver.id = $1";
            params = [Number(id)];
        }

        console.log("Checkpoint 2");

        const count = await db.query(
            `SELECT COUNT(*)
             FROM TRANSACTIONS t
                      LEFT JOIN ACCOUNTS fa
                                ON t.from_account_id=fa.id
                      LEFT JOIN USERS sender
                                ON fa.cust_id=sender.id
                      LEFT JOIN ACCOUNTS ta
                                ON t.to_account_id=ta.id
                      LEFT JOIN USERS receiver
                                ON receiver.id=ta.cust_id
             WHERE ${filter}`,
            params
        )

        const total = Number(count.rows[0].total);

        console.log("Checkpoint 3");

        const result = await db.query(
            `SELECT t.id, t.type, sender.name as sender, fa.account_number as from_account_number, receiver.name as receiver, ta.account_number as to_account_number, t.amount, t.status, t.created_at
            FROM TRANSACTIONS t
            LEFT JOIN ACCOUNTS fa
            ON t.from_account_id=fa.id
            LEFT JOIN USERS sender
            ON fa.cust_id=sender.id
            LEFT JOIN ACCOUNTS ta
            ON t.to_account_id=ta.id
            LEFT JOIN USERS receiver
            ON receiver.id=ta.cust_id
            WHERE ${filter}
            ORDER BY t.created_at DESC
            LIMIT $2
            OFFSET $3`,
            [...params, limit, offset]
        );

        console.log("Checkpoint 4");

        res.json({
            status: "success",
            transactions: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit)
            }
        });
    }
    catch (e){
        res.status(500).json({
            messages: "Failed to fetch transaction history"
        });
    }
});

app.get("/api/accounts/customers", async (req, res)=>{
    try{
        const result = await db.query(
          `SELECT u.id as customer_id, u.name, a.id as account_id, a.account_number, a.balance 
            FROM USERS u
            JOIN ACCOUNTS a
            ON u.id = a.cust_id
            WHERE role='customer'
            ORDER BY u.name`
        );

        res.json({
            message: "Accounts fetched successfully",
            accounts: result.rows
        });
    }
    catch (e){
        res.status(500).json({
            message: "Server Error",
            error: e
        })
    }
});

app.post("/api/transactions/deposit", authenticateToken, async (req, res) => {
    const client = await db.connect();
    const { accountId, amount } = req.body;
    const depositAmount = Number(amount);

    console.log(accountId);
    console.log(amount);

    try{

        if(!accountId || !depositAmount || depositAmount<=0){
            return res.status(400).json({
                message: "Invalid account or amount"
            });
        }

        console.log(req.user.id);

        await client.query("BEGIN");

        const result = await client.query(
            `UPDATE ACCOUNTS 
            SET balance=balance+$1
            WHERE id = $2`,
            [depositAmount, accountId]
        );

        if(result.rowCount === 0){
            await client.query("ROLLBACK");

            return res.status(404).json({
               message: "Account not found"
            });
        }

        await client.query(
            `INSERT INTO TRANSACTIONS (type, to_account_id, amount, status, created_by)
            VALUES ($1, $2, $3, $4, $5)`,
            ["deposit", accountId, depositAmount, "completed", req.user.id]
        );

        await client.query("COMMIT");

        return res.json({
           message: "Deposit Successfully"
        });
    }
    catch (e){
        await client.query('ROLLBACK');

        try{
            await client.query(
                `INSERT INTO TRANSACTIONS (type, to_account_id, amount, status, created_by)
                 VALUES ($1, $2, $3, $4, $5)`,
                ["deposit", accountId, depositAmount, "failed", req.user.id]
            );
        }
        catch (e){
            console.error(e);
        }

        console.error(e);

        return res.status(500).json({
            message: "Deposit Failed"
        });
    }
    finally {
        client.release();
    }
});

app.post("/api/transactions/withdrawal", authenticateToken, async (req, res) => {
    const client = await db.connect();
    const { accountId, amount } = req.body;

    try{
       if(!accountId || !amount || amount<=0){
           return res.status(400).json({
               message: "Invalid account or amount"
           });
       }

       await client.query("BEGIN");

       const result = await client.query(
           `SELECT balance FROM ACCOUNTS
            WHERE id=$1`, [accountId]
       );

       console.log(result.rows[0].balance);

       if(Number(result.rows[0].balance) < Number(amount)){
           await client.query("ROLLBACK");

           try{
               await client.query(
                   `INSERT INTO TRANSACTIONS (type, from_account_id, amount, status, created_by)
                    VALUES ($1, $2, $3, $4, $5)`,
                   ["withdraw", accountId, amount, "failed", req.user.id]
               );
           }
           catch (e){
               console.error(e);
           }

           return res.status(400).json({
               message: "Insufficient balance"
           })
       }

       await client.query(
           `UPDATE ACCOUNTS 
            SET balance=balance-$1
            WHERE id = $2`,
           [amount, accountId]
       );

       await client.query(
           `INSERT INTO TRANSACTIONS (type, from_account_id, amount, status, created_by)
            VALUES ($1, $2, $3, $4, $5)`,
           ["withdraw", accountId, amount, "completed", req.user.id]
       );

       await client.query("COMMIT");

       res.json({
           message: "Withdraw Successfully"
       });
   }
   catch (e){
       await client.query('ROLLBACK');

       try{
           await client.query(
               `INSERT INTO TRANSACTIONS (type, from_account_id, amount, status, created_by)
                VALUES ($1, $2, $3, $4, $5)`,
               ["withdraw", accountId, amount, "failed", req.user.id]
           );
       }
       catch (e){
           console.error(e);
       }

       res.status(500).json({
           message: "Withdraw Failed"
       });
   }
   finally {
       await client.release();
   }
});

app.post("/api/transactions/transfer", authenticateToken, async (req, res) => {
    const client = await db.connect();
    const { fromAccountId, toAccountId, amount } = req.body;

    if(!fromAccountId || !toAccountId || !amount || amount<=0){
        return res.status(400).json({
            message: "Invalid account or amount"
        });
    }

    try{
        console.log(fromAccountId);
        console.log(toAccountId);

       await client.query("BEGIN");

       console.log("Check point 0");

       const result = await client.query(
           `SELECT balance FROM ACCOUNTS
            WHERE id=$1`, [fromAccountId]
       );

       console.log(typeof(result.rows[0].balance));
       console.log(typeof(amount));
       console.log((result.rows[0].balance) < amount);

       if(Number(result.rows[0].balance) < Number(amount)){
           await client.query("ROLLBACK");

           try{
               await client.query(
                   `INSERT INTO TRANSACTIONS (type, from_account_id, to_account_id, amount, status, created_by)
                    VALUES ($1, $2, $3, $4, $5, $6)`,
                   ["transfer", fromAccountId, toAccountId, amount, "failed", req.user.id]
               );
           }
           catch (e){
               console.error(e);
           }

           return res.status(400).json({
               message: "Insufficient balance for transfer"
           })
       }

       console.log("Check point 1");

       await client.query(
           `UPDATE ACCOUNTS 
            SET balance=balance-$1
            WHERE id = $2`,
           [amount, fromAccountId]
       );

       console.log("Check point 2");

       await client.query(
           `UPDATE ACCOUNTS
            SET balance=balance+$1
            WHERE id = $2`,
           [amount, toAccountId]
       );

       console.log("Check point 3");

        await client.query(
           `INSERT INTO TRANSACTIONS (type, from_account_id, to_account_id, amount, status, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)`,
           ["transfer", fromAccountId, toAccountId, amount, "completed", req.user.id]
        );

        console.log("Check point 4");

        await client.query("COMMIT");

       res.json({
           message: "Transfer Successfully"
       });

   }
   catch (e){
       await client.query('ROLLBACK');

       try{
           await client.query(
               `INSERT INTO TRANSACTIONS (type, from_account_id, to_account_id, amount, status, created_by)
                VALUES ($1, $2, $3, $4, $5, $6)`,
               ["transfer", fromAccountId, toAccountId, amount, "failed", req.user.id]
           );
       }
       catch (e){
           console.error(e);
       }

       res.status(500).json({
           message: "Transfer Failed"
       });
   }
   finally {
        await client.release();
   }
});



const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});