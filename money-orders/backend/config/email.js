const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: process.env.SMTP_PORT,
   secure: false
});

module.exports = transporter;