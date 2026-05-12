require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email Service test failed:', error.message);
    } else {
        console.log('✅ Email Service works!');
    }
});
