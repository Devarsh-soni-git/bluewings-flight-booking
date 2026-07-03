const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by reference
router.get('/:reference', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingReference: req.params.reference,
      user: req.user.id
    });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { flight, passengers } = req.body;
    
    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.2; // 80% success rate
    
    const booking = new Booking({
      user: req.user.id,
      bookingReference: `BK-${Date.now().toString().slice(-6)}-${uuidv4().slice(0, 4)}`,
      flight,
      passengers,
      status: paymentSuccess ? 'confirmed' : 'pending',
      paymentStatus: paymentSuccess ? 'completed' : 'failed'
    });
    
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.put('/:reference/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findOne({
      bookingReference: req.params.reference,
      user: req.user.id
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }
    
    booking.status = 'cancelled';
    booking.cancellationReason = reason || 'Cancelled by user';
    booking.modifiedDate = new Date();
    await booking.save();
    
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Modify booking (simplified)
router.put('/:reference', auth, async (req, res) => {
  try {
    const { flight } = req.body;
    const booking = await Booking.findOne({
      bookingReference: req.params.reference,
      user: req.user.id
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot modify cancelled booking' });
    }
    
    booking.flight = flight;
    booking.status = 'modified';
    booking.modifiedDate = new Date();
    await booking.save();
    
    res.json({ message: 'Booking modified successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;