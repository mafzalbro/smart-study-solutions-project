const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail username
    pass: process.env.EMAIL_PASS, // Your Gmail password
  },
});

// console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

// Function to send password reset email
async function sendPasswordResetEmail(email, resetLink) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click the following link to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}

// Function to send general emails (example)
async function sendGenericEmail(email, subject, message, html) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Generic email sent to ${email}`);
  } catch (error) {
    console.error("Error sending generic email:", error);
    throw new Error("Failed to send generic email");
  }
}

module.exports = { sendPasswordResetEmail, sendGenericEmail };
