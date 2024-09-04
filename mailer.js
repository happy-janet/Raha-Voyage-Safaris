// mailer.js
const nodemailer = require('nodemailer');

// Configure SMTP transport options
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP host, e.g., 'smtp.gmail.com' for Gmail
  port: 587, // Typically 587 for TLS, 465 for SSL, 25 for non-secure
  secure: false, // Set to true if you use port 465
  auth: {
    user: 'your-email@example.com', // Your email address
    pass: 'your-email-password' // Your email password or app-specific password
  }
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: '"Your Name" <your-email@example.com>', // Sender address
      to, // Receiver's address
      subject, // Subject line
      text, // Plain text body
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
