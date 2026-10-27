const bcrypt = require('bcrypt');
const db = require('./config/db');


async function seed(){
    const managerPassword = await bcrypt.hash("manager@123", 10);
    const customerPassword = await bcrypt.hash("customer@123", 10);
    const adminPassword = await bcrypt.hash("admin@123", 10);

    await db.query(
        `INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, 'admin')`,
        ["Jignesh Parmar", "jignesh.parmar@gmail.com", adminPassword]
    );
}

seed();