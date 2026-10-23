const authService = require("../services/auth.service");

async function login(req, res){
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        console.log(email);
        const result = await authService.login(email, password);
        console.log(result);

        if(!result){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        res.cookie("token", result.token, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 24*60*60*1000,
            path: "/"
        });

        return res.json({
            status: "success",
            message: "Login successful",
            token: result.token ,
            user: result.user
        });
    }
    catch (e){
        console.error(e);

        return res.status(500).json({
           message: "Server error"
        });
    }
}

async function getMe(req, res){
    try{
        const user = await authService.getMe(req.user);

        if(!user){
            return res.status(404).json({
               message: "User not found"
            });
        }

        return res.json({
            message: "User fetched successfully",
            user
        });
    }
    catch (e){
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

async function signup(req, res){
    try{
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "Name, Email and password are required"
            });
        }

        const result = await authService.signup(name, email, password);

        return res.status(201).json(result);
    }
    catch (e){
        return res.status(500).json({
            message: "Account already exists!"
        });
    }
}

async function logout(req, res){
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        path: "/"
    });

    return res.status(200).json({
        message: "Logged out successfully"
    });
}

module.exports = { login, signup, logout, getMe };