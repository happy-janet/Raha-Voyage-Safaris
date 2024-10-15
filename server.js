require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(bodyParser.json()); // Parse JSON form data

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });

// OAuth for Pesapal
const oauth = OAuth({
    consumer: {
        key: process.env.PESAPAL_CONSUMER_KEY,
        secret: process.env.PESAPAL_CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
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

// Pesapal Payment Initiation Route
// Pesapal Payment Initiation Route
app.post('/pay', async (req, res) => {
    const { amount, currency, description } = req.body;
    const pesapalRequestTokenUrl = process.env.PESAPAL_API_URL;

    const paymentPayload = {
        amount,
        currency,
        description,
        // No callback_url or notification_id here, since you mentioned you don't have them
    };

    const request_data = {
        url: pesapalRequestTokenUrl,
        method: 'POST',
        data: paymentPayload,
    };

    const headers = oauth.toHeader(oauth.authorize(request_data));
    headers['Content-Type'] = 'application/json'; // Set the content type to application/json

    try {
        console.log('Sending request to Pesapal:', JSON.stringify(paymentPayload, null, 2));
        console.log('Request headers:', headers);

        // Request Pesapal token
        const response = await axios.post(pesapalRequestTokenUrl, paymentPayload, { headers });
        console.log('Pesapal response:', response.data);

        const { redirect_url } = response.data;
        res.json({ redirect_url });
    } catch (error) {
        console.error('Error initiating payment:', error.message);
        console.error('Error details:', error.response?.data || 'No response data');
        res.status(500).send('Payment initiation failed');
    }
});
// Pesapal Payment Status Query Route
app.post('/payment-status', async (req, res) => {
    const { transaction_id } = req.body;
    const pesapalQueryUrl = `${process.env.PESAPAL_STATUS_URL}?orderTrackingId=${transaction_id}`; // Using env variable for Pesapal status URL

    const request_data = {
        url: pesapalQueryUrl,
        method: 'GET',
    };

    const headers = oauth.toHeader(oauth.authorize(request_data));

    try {
        const response = await axios.get(pesapalQueryUrl, { headers });
        const { payment_status } = response.data;

        if (payment_status === 'COMPLETED') {
            console.log('Payment successful:', response.data);
            res.send('Payment completed successfully');
        } else {
            console.log('Payment failed or pending:', response.data);
            res.send('Payment failed or is pending');
        }
    } catch (error) {
        console.error('Error querying payment status:', error.message);
        res.status(500).send('Error querying payment status');
    }
});

// Pesapal Payment Callback Route
app.post('/callback', (req, res) => {
    const { status, transaction_id, order_id } = req.body;

    if (status === 'COMPLETED') {
        console.log('Payment successful:', { transaction_id, order_id });
        res.send('Payment successful');
    } else {
        console.log('Payment failed:', { transaction_id, order_id });
        res.send('Payment failed');
    }
});

// Fallback for undefined routes (404 error)
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
