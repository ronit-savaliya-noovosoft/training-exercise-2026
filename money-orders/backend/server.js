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

app.use(cors());
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
           maxAge: 60*60*1000
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

app.get("/api/auth/me", async (req, res) => {
    try{
        const result = await db.query(
            `SELECT name, email, password
            FROM USERS
            WHERE id = $1`,
            [req.user.id]
        );

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
                        VALUES ($1, $2, $3, "customer")`, [name, email, passwordHash]);

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

app.get("/api/transactions", async (req, res) => {
    try{
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(10, Math.max(1, parseInt(req.query.limit, 10) || 1));
        const offset = (page-1) * limit;

        let filter, params;
        const { id, role } = req.user;

        if(role === 'manager'){
           filter = "t.created_by = $1";
           params = [id];
        }
        else{
            filter = `(
                from_user.id = $1 OR
                to_user.id = $1
            )`;
            params = [id];
        }

        const count = await db.query(
            `SELECT COUNT(*) AS total
            FROM TRANSACTIONS t
            LEFT JOIN ACCOUNTS to_account
            ON t.to_account_id=to_account.id
            LEFT JOIN ACCOUNTS from_account
            ON t.from_account_id= from_account.id
            WHERE ${filter}`,
            params
        )

        const total = Number(count.rows[0].total);

        const result = await db.query(
            `SELECT t.id, t.type, sender.name, fa.account_number, receiver.name, ta.account_number, t.amount, t.status, t.created_at
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

        res.json({
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
            WHERE role='customer'`
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
    try{
        const { accountId, amount } = req.body;

        if(!accountId || !amount || amount<=0){
            return res.status(400).json({
                message: "Invalid account or amount"
            });
        }

        console.log(req.user.id);

        await client.query("BEGIN");

        await client.query(
            `UPDATE ACCOUNTS 
            SET balance=balance+$1
            WHERE id = $2`,
            [amount, accountId]
        );

        await client.query(
            `INSERT INTO TRANSACTIONS (type, to_account_id, amount, status, created_by)
            VALUES ("deposit", $1, $2, "completed", $3)`,
            [accountId, amount, req.user.id]
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
                VALUES ("deposit", $1, $2, "failed", $3)`,
                [accountId, amount, req.user.id]
            );
        }
        catch (e){
            console.error(e);
        }

        return res.status(500).json({
            message: "Deposit Failed"
        });
    }
    finally {
        client.release();
    }
});

app.post("/api/transactions/withdrawal", async (req, res) => {
   const client = await db.connect();
   try{
       const { accountId, amount } = req.body;

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

       if(result.rows[0].balance < amount){
           await client.query("ROLLBACK");

           try{
               await client.query(
                   `INSERT INTO TRANSACTIONS (type, from_account_id, amount, status, created_by)
                    VALUES ("withdraw", $1, $2, "failed", $3)`,
                   [accountId, amount, req.user.id]
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
            VALUES ("withdraw", $1, $2, "completed", $3)`,
           [accountId, amount, req.user.id]
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
                VALUES ("withdraw", $1, $2, "failed", $3)`,
               [accountId, amount, req.user.id]
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

app.post("/api/transactions/transfer", async (req, res) => {
   const client = await db.connect();
   try{
       const { fromAccountId, toAccountId, amount } = req.body;

       if(!fromAccountId || !toAccountId || !amount || amount<=0){
           return res.status(400).json({
               message: "Invalid account or amount"
           });
       }

       await client.query("BEGIN");

       const result = await client.query(
           `SELECT balance FROM ACCOUNTS
            WHERE id=$1`, [fromAccountId]
       );

       if(result.rows[0].balance < amount){
           await client.query("ROLLBACK");

           try{
               await client.query(
                   `INSERT INTO TRANSACTIONS (type, from_account_id, to_account_id, amount, status, created_by)
                    VALUES ("transfer", $1, $2, $3, "failed", $4)`,
                   [fromAccountId, toAccountId, amount, req.user.id]
               );
           }
           catch (e){
               console.error(e);
           }

           return res.status(400).json({
               message: "Insufficient balance for transfer"
           })
       }

       await client.query(
           `UPDATE ACCOUNTS 
            SET balance=balance-$1
            WHERE id = $2`,
           [amount, fromAccountId]
       );

       await client.query(
           `UPDATE ACCOUNTS
            SET balance=balance+$1
            WHERE id = $2`,
           [amount, toAccountId]
       );

       await client.query(
           `INSERT INTO TRANSACTIONS (type, from_account_id, to_account_id, amount, status, created_by)
            VALUES ("transfer", $1, $2, $3, "completed", $4)`,
           [fromAccountId, toAccountId, amount, req.user.id]
       );

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
                VALUES ("withdraw", $1, $2, $3, "failed", $4)`,
               [fromAccountId, toAccountId, amount, req.user.id]
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