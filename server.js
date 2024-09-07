require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const SafariBooking = require('./Models/safariBookingModel');
const Booking = require('./Models/Booking'); 
const cors = require('cors');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const request = require('request');
const axios = require('axios');  // Use axios for HTTP requests

const app = express();

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To handle JSON form submissions

// Connect to MongoDB using environment variables
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err.message); // Improved error logging
        process.exit(1); // Exit the application if the connection fails
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
        console.log('Error sending email: ', error);
    }
};

// Serve the booking form
app.get('/book', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Update this path to the location of your HTML form
});

// Handle form submissions (booking form)
app.post('/book', async (req, res) => {
    try {
        const bookingData = req.body;
        const newBooking = new Booking(bookingData);

        await newBooking.save(); // Await the save operation

        // Send confirmation email
        await sendEmail(
            process.env.EMAIL_USER, // Send email to yourself or use another recipient
            'New Booking',
            `New booking received:\n\n${JSON.stringify(bookingData, null, 2)}`
        );

        res.send('Booking Submitted Successfully');
    } catch (err) {
        console.error('Error saving booking:', err.message); // Log the error message
        res.status(500).send(`Error saving booking: ${err.message}`); // Send detailed error response
    }
});

// Serve the Safari booking form
app.get('/book-safari', (req, res) => {
    res.sendFile(__dirname + '/public/safari-booking-form.html'); // Corrected the path to the location of your HTML form
});

// Handle form submissions (safari booking form)
app.post('/book-safari', async (req, res) => {
    try {
        const safariData = req.body;
        const newBooking = new SafariBooking(safariData);

        await newBooking.save(); // Await the save operation

        // Send confirmation email
        await sendEmail(
            process.env.EMAIL_USER, // Send email to yourself or use another recipient
            'New Safari Booking',
            `New safari booking received:\n\n${JSON.stringify(safariData, null, 2)}`
        );

        res.send('Safari Booking Submitted Successfully');
    } catch (err) {
        console.error('Error saving booking:', err.message); // Log the error message
        res.status(500).send(`Error saving booking: ${err.message}`); // Send detailed error response
    }
});


// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// OAuth setup
const oauth = OAuth({
    consumer: {
        key: process.env.PESAPAL_CONSUMER_KEY,
        secret: process.env.PESAPAL_CONSUMER_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (base_string, key) => crypto.createHmac('sha1', key).update(base_string).digest('base64')
});
<<<<<<< Updated upstream

=======
// Handle Pesapal payment processing
>>>>>>> Stashed changes
app.post('/pesapal-payment', async (req, res) => {
    const { amount, email, phone } = req.body;

    try {
<<<<<<< Updated upstream
        // Use the sandbox URL for development and testing
        const pesapalUrl = "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest";  // Sandbox URL
=======
        const pesapalUrl = "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest"; // Sandbox URL
>>>>>>> Stashed changes
        
        // Prepare the payment data
        const paymentData = {
            amount,
            currency: "KES",
            description: 'Payment for service',
<<<<<<< Updated upstream
            callback_url: "https://yourwebsite.com/callback",  // Update to your callback URL
            notification_id: "unique-notification-id",
            billing_address: {
                email_address: email,
                phone_number: phone,
                first_name: "John", // Replace with actual data
                last_name: "Doe",   // Replace with actual data
                line_1: "Address Line 1",
                city: "City",
                postal_code: "00100",
                country_code: "KE"
=======
            callback_url: "http://localhost:3000/callback",  // Update to your callback URL
            billing_address: {
                email_address: email,
                phone_number: phone,
>>>>>>> Stashed changes
            }
        };

        // OAuth authorization
        const request_data = {
            url: pesapalUrl,
            method: 'POST',
            data: paymentData
        };

        const headers = oauth.toHeader(oauth.authorize(request_data));

        // Make the request to Pesapal Sandbox
        const response = await axios.post(pesapalUrl, paymentData, { headers });

        // Return the redirect URL for Pesapal
        if (response.data.redirect_url) {
            res.json({ redirectUrl: response.data.redirect_url });
        } else {
            res.status(500).send('Payment failed');
        }

    } catch (error) {
        console.error('Pesapal Payment Error:', error);
        res.status(500).send('Payment Error');
    }
});


<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
