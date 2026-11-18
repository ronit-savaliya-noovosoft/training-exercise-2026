const authRepository = require("../repositories/auth.repository");
const db = require("../config/db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email");

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
        //
        // const lastAccountNo = await accountRepository.getLastAccountNumber();
        // const newAccountNo = Number(lastAccountNo.replaceAll(" ", ""))+1;
        //
        // if(isNaN(newAccountNo)){
        //     await client.query("ROLLBACK");
        //     return;
        // }
        //
        // const accountNumber = newAccountNo.toString().replace(/(.{4})/g, '$1 ').trim();
        // await accountRepository.createAccount(client, accountNumber, customerId, 0);

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
        return authRepository.getCustomerProfile(user.id, user.activeAccountId);
    }

    return authRepository.getUserProfile(user.id);
}

async function forgotPassword(email){
    const user = await authRepository.findUserByEmail(email);

    if(!user){
        return {
            status: "success",
            message: "If the email is registered, a password reset link will be sent."
        }
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    await authRepository.deleteOldResetToken(user.id);
    await authRepository.createPasswordResetToken(user.id, tokenHash);

    const resetLink = `${process.env.FRONTEND_URL}/resetPassword.html?token=${resetToken}`;

    await transporter.sendMail({
       from: '"Banking App"<banking-app@localhost>',
       to: user.email,
       subject: "Reset Your Password",
       html: `
            <h2>Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>We received a request to reset your password.</p>
            <p><a href="${resetLink}">Reset Password</a></p>
            <p>This link expires in 15 minutes.</p>
            <p>If you did not request this, you can ignore this email</p>
       `
    });

    return {
        status: "success",
        message: "If the email is registered, a password reset link will be sent."
    }
}

async function resetPassword(token, newPassword){
    if(!token || !newPassword){
        throw new Error("Token and password are required")
    }

    if(newPassword.length<8){
        throw new Error("Password must be at least 8 characters long");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const client = await db.connect();

    try{
        await client.query("BEGIN");

        const resetToken = await authRepository.getValidResetToken(client, tokenHash);

        if(!resetToken){
            throw new Error("Invalid or expired reset link");
        }

        await authRepository.updateUserPassword(client, resetToken.user_id, hashedPassword);

        await authRepository.markResetTokenUsed(client, resetToken.id);

        await client.query("COMMIT");

        return {
            status: "success",
            message: "Password reset successfully"
        }
    }
    catch (e) {
        await client.query("ROLLBACK");
        throw e;
    }
    finally {
        client.release();
    }
}


module.exports = { login, signup, getMe, forgotPassword, resetPassword };