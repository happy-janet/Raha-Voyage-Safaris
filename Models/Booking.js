const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  leavingDate: {
    type: Date,
    required: true
  }
});

// Create the booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
