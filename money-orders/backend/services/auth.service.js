const authRepository = require("../repositories/auth.repository");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(email, password){
    const user = await authRepository.findUserByEmail(email);

    if(!user){
        throw new Error("User not exists");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
        console.log("Password does not match");
        return null;
    }

    const token = jwt.sign({
           id: user.id,
           name: user.name,
           email: user.email,
           role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        message: "Logged in successfully",
        status: "success",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

async function signup(name, email, password){
    const exist = await authRepository.checkEmail(email);

    if(exist >= 1){
        return {
            status: "failed",
            message: "Email already registered"
        }
    }

    const client = await db.connect();

    try{
        await client.query("BEGIN");

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await authRepository.createCustomer(client, name, email, passwordHash);
        const customerId = result.rows[0].id;

        // const min = 1000000000000000;
        // const max = 9999999999999999;
        // const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        const lastAccountNo = await authRepository.getLastAccountNumber();
        const newAccountNo = Number(lastAccountNo.replaceAll(" ", ""))+1;

        if(isNaN(newAccountNo)){
            await client.query("ROLLBACK");
            return;
        }

        const accountNumber = newAccountNo.toString().replace(/(.{4})/g, '$1 ').trim();
        await authRepository.createAccount(client, accountNumber, customerId, 0);

        await client.query("COMMIT");
    }
    catch (e) {
        await client.query("ROLLBACK");
        throw e;
    }
    finally {
        await client.release();
    }

    return {
        status: "success",
        message: "Customer Sign Up successfully"
    };
}

async function getMe(user){
    if(user.role === "customer"){
        return authRepository.getCustomerProfile(user.id);
    }

    return authRepository.getUserProfile(user.id);
}


module.exports = { login, signup, getMe };