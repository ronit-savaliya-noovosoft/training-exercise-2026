const authRepository = require("../repositories/auth.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(email, password){
    const user = await authRepository.findUserByEmail(email);

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
        { expiresIn: "1h" }
    );

    return {
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
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await authRepository.createCustomer(name, email, passwordHash);

    const customerId = result.rows[0].id;

    const min = 1000000000000000;
    const max = 9999999999999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const accountNumber = randomNumber.toString().replace(/(.{4})/g, '$1 ').trim();

    await authRepository.createAccount(accountNumber, customerId, 0);

    return {
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