const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  flight: {
    airline: String,
    flightNumber: String,
    origin: String,
    destination: String,
    departureDate: Date,
    departureTime: String,
    arrivalTime: String,
    price: Number,
    currency: { type: String, default: 'USD' }
  },
  passengers: [{
    name: String,
    age: Number,
    passportNumber: String
  }],
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'modified', 'pending'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  modifiedDate: Date,
  cancellationReason: String,
  notes: String
});

module.exports = mongoose.model('Booking', BookingSchema);