// safariBookingModel.js
const mongoose = require('mongoose');

// Define the schema for the safari booking
const safariBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  nationality: {
    type: String,
    required: true,
    enum: ['resident', 'non-resident']
  },
  phone: {
    type: String,
    required: true
  },
  accommodationType: {
    type: String,
    required: true,
    enum: ['luxury', 'midrange', 'budget']
  },
  safariPackage: {
    type: String,
    required: true
  },
  adults: {
    type: Number,
    required: true,
    min: 1
  },
  children: {
    type: Number,
    default: 0,
    min: 0
  },
  safariType: {
    type: String,
    required: true,
    enum: ['game-drive', 'boat-safari', 'nature-walk', 'horseback-safari']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  specialRequests: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model from the schema
const SafariBooking = mongoose.model('SafariBooking', safariBookingSchema);

module.exports = SafariBooking;
