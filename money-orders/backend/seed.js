const bcrypt = require('bcrypt');
const db = require('./db');


async function seed(){
    const managerPassword = await bcrypt.hash("manager@123", 10);
    const customerPassword = await bcrypt.hash("customer@123", 10);

    await db.query(
        `INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, 'manager'),
               ($4, $5, $6, 'customer'),
               ($7, $8, $9, 'customer')`,
        ["Jayesh Joshi", "jayesh.joshi@gmail.com", managerPassword,
        "Rixit Dobariya", "rixit.dobariya@gmail.com", customerPassword,
        "Smit Udani", "smit.udani@gmail.com", customerPassword]
    );

    await db.query(
        `INSERT INTO accounts (account_number, cust_id, balance)
        VALUES ($1, $2, $3),
               ($4, $5, $6)`,
        ["4321 8765 0987 6543", 2, 10000.00,
        "4321 8765 0987 6544", 3, 5000.00]
    );
}

seed();