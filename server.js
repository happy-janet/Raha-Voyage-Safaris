require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const SafariBooking = require('./Models/safariBookingModel');
const Booking = require('./Models/Booking'); 

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

// Start the server using environment variable for port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
