require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const axios = require('axios');
const SafariBooking = require('./Models/safariBookingModel');
const Booking = require('./Models/Booking');
const cors = require('cors');
const helmet = require('helmet');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const app = express();

// Middleware
app.use(express.static('public')); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(bodyParser.json()); // Parse JSON form data
app.use(cors({
    origin: 'https://your-frontend-domain.com', // Replace with your frontend domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet()); // Set security headers

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

// Serve the booking form
app.get('/book', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle form submissions (general booking form)
app.post('/book', async (req, res) => {
    try {
        const bookingData = req.body;
        const newBooking = new Booking(bookingData);

        await newBooking.save(); // Await the save operation

        // Send confirmation email
        await sendEmail(
            process.env.EMAIL_USER,
            'New Booking',
            `New booking received:\n\n${JSON.stringify(bookingData, null, 2)}`
        );

        res.send('Booking Submitted Successfully');
    } catch (err) {
        console.error('Error saving booking:', err.message);
        res.status(500).send(`Error saving booking: ${err.message}`);
    }
});

// Serve the Safari booking form
app.get('/book-safari', (req, res) => {
    res.sendFile(__dirname + '/public/safari-booking-form.html');
});

// Handle form submissions (safari booking form)
app.post('/book-safari', async (req, res) => {
    try {
        const safariData = req.body;
        const newBooking = new SafariBooking(safariData);

        await newBooking.save();

        // Send confirmation email
        await sendEmail(
            process.env.EMAIL_USER,
            'New Safari Booking',
            `New safari booking received:\n\n${JSON.stringify(safariData, null, 2)}`
        );

        res.send('Safari Booking Submitted Successfully');
    } catch (err) {
        console.error('Error saving booking:', err.message);
        res.status(500).send(`Error saving booking: ${err.message}`);
    }
});

// Pesapal Payment Integration
app.post('/create-pesapal-order', async (req, res) => {
    const { amount, email } = req.body;
    const orderReference = `ORD-${Math.floor(Math.random() * 1000000)}`;

    try {
        // Get OAuth Token from Pesapal
        const tokenResponse = await axios.post('https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${process.env.PESAPAL_CONSUMER_KEY}:${process.env.PESAPAL_CONSUMER_SECRET}`).toString('base64')}`
            }
        });

        if (!tokenResponse.data || !tokenResponse.data.token) {
            throw new Error('Failed to obtain OAuth token from Pesapal.');
        }
        const { token } = tokenResponse.data;

        // Post the Direct Order to Pesapal
        const orderData = {
            Amount: amount,
            Currency: 'UGX',
            Description: 'Payment for services',
            Type: 'MERCHANT',
            Reference: orderReference,
            Email: email
        };

        const orderResponse = await axios.post('https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest', orderData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!orderResponse.data || !orderResponse.data.redirect_url) {
            throw new Error('Failed to create Pesapal order.');
        }

        res.json({ paymentUrl: orderResponse.data.redirect_url });

    } catch (error) {
        console.error('Error creating Pesapal order:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message || 'Failed to create Pesapal order' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
