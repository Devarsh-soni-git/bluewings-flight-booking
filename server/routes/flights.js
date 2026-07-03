const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Sample flight data (simulated API)
const flights = [
  {
    id: 'FL001',
    airline: 'SkyJet Airways',
    flightNumber: 'SJ-401',
    origin: 'New York (JFK)',
    destination: 'London (LHR)',
    departureDate: '2026-07-15',
    departureTime: '08:00',
    arrivalTime: '20:00',
    price: 450,
    currency: 'USD',
    availableSeats: 12
  },
  {
    id: 'FL002',
    airline: 'BlueWings Airlines',
    flightNumber: 'BW-203',
    origin: 'London (LHR)',
    destination: 'Paris (CDG)',
    departureDate: '2026-07-15',
    departureTime: '10:30',
    arrivalTime: '12:45',
    price: 120,
    currency: 'EUR',
    availableSeats: 8
  },
  {
    id: 'FL003',
    airline: 'Global Air',
    flightNumber: 'GA-889',
    origin: 'Tokyo (NRT)',
    destination: 'New York (JFK)',
    departureDate: '2026-07-16',
    departureTime: '22:00',
    arrivalTime: '06:00',
    price: 780,
    currency: 'USD',
    availableSeats: 5
  },
  {
    id: 'FL004',
    airline: 'SkyJet Airways',
    flightNumber: 'SJ-512',
    origin: 'Singapore (SIN)',
    destination: 'Sydney (SYD)',
    departureDate: '2026-07-16',
    departureTime: '09:15',
    arrivalTime: '18:45',
    price: 520,
    currency: 'SGD',
    availableSeats: 15
  },
  {
    id: 'FL005',
    airline: 'BlueWings Airlines',
    flightNumber: 'BW-167',
    origin: 'Dubai (DXB)',
    destination: 'Mumbai (BOM)',
    departureDate: '2026-07-17',
    departureTime: '13:00',
    arrivalTime: '18:30',
    price: 280,
    currency: 'USD',
    availableSeats: 20
  }
];

// Search flights
router.post('/search', auth, async (req, res) => {
  try {
    const { origin, destination, departureDate } = req.body;
    
    let results = flights;
    
    if (origin) {
      results = results.filter(f => f.origin.toLowerCase().includes(origin.toLowerCase()));
    }
    if (destination) {
      results = results.filter(f => f.destination.toLowerCase().includes(destination.toLowerCase()));
    }
    if (departureDate) {
      results = results.filter(f => f.departureDate === departureDate);
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get flight by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const flight = flights.find(f => f.id === req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;