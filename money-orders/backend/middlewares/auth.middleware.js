const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

function authenticateToken(req, res, next){
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];

    const token = req.cookies?.token;

    // console.log(token);

    if(!token){
        return res.status(401).json({
            message: "Access token required"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user)=>{
        if(error){
            return res.status(403).json({
                message: "Invalid or expired token"
            })
        }

        req.user = user;

        next();
    });
}

function authorizeRole(...roles){
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
               message: "Access denied"
            });
        }

        next();
    }
}

module.exports = authenticateToken;