require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(bodyParser.json()); // Parse JSON form data

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });

// Function to send email
const sendEmail = async (recipient, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipient,
            subject: subject,
            text: text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle contact form submissions
app.post('/contact', async (req, res) => {
    try {
        const { name, email, number, subject, message } = req.body;
        const emailContent = `
            Name: ${name}
            Email: ${email}
            Phone Number: ${number}
            Subject: ${subject}
            Message: ${message}
        `;
        await sendEmail(process.env.EMAIL_USER, `New Contact Form Submission: ${subject}`, emailContent);
        res.send('Your message has been sent successfully!');
    } catch (err) {
        console.error('Error handling contact form submission:', err.message);
        res.status(500).send('Failed to send your message. Please try again later.');
    }
});

// Serve the booking form
app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ... (rest of your existing routes)

// Fallback for undefined routes (404 error)
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
