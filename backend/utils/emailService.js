const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USER, // Check your .env for this
            pass: process.env.EMAIL_PASS  // Check your .env for this
        }
    });

    // 2. Define the email options
    const message = {
        from: `${process.env.FROM_NAME || 'Support'} <${process.env.FROM_EMAIL || 'noreply@test.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // 3. Send the email (This is what throws the error if credentials are bad)
    await transporter.sendMail(message);
};

module.exports = sendEmail;