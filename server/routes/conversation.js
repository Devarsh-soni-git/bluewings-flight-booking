const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Get or create conversation
router.get('/', auth, async (req, res) => {
  try {
    let conversation = await Conversation.findOne({
      user: req.user.id,
      isActive: true
    });
    
    if (!conversation) {
      conversation = new Conversation({
        user: req.user.id,
        messages: [
          {
            sender: 'bot',
            text: '👋 Welcome to BlueWings Airlines! I\'m your travel assistant. I can help you with:\n\n✈️ Book a new flight\n📋 View your bookings\n🔄 Cancel or modify bookings\n💬 General inquiries\n\nWhat would you like to do today?'
          }
        ]
      });
      await conversation.save();
    }
    
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    let conversation = await Conversation.findOne({
      user: req.user.id,
      isActive: true
    });
    
    if (!conversation) {
      conversation = new Conversation({ user: req.user.id, messages: [] });
    }
    
    // Add user message
    conversation.messages.push({
      sender: 'user',
      text: message
    });
    
    // Generate bot response
    const botResponse = await generateBotResponse(message, conversation, req.user.id);
    conversation.messages.push({
      sender: 'bot',
      text: botResponse.text,
      context: botResponse.context
    });
    
    if (botResponse.intent) {
      conversation.currentIntent = botResponse.intent;
    }
    
    conversation.updatedAt = new Date();
    await conversation.save();
    
    res.json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Agent handoff
router.post('/agent-handoff', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      user: req.user.id,
      isActive: true
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'No active conversation' });
    }
    
    conversation.messages.push({
      sender: 'bot',
      text: '🔄 Connecting you to a live agent. Please wait...\n\nAn agent will be with you shortly. They will have access to our conversation history.'
    });
    
    conversation.currentIntent = 'agent_handoff';
    await conversation.save();
    
    // In a real system, this would trigger a notification to an agent queue
    res.json({
      message: 'Agent handoff initiated',
      conversation
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate bot response (business logic)
async function generateBotResponse(message, conversation, userId) {
  const lower = message.toLowerCase();
  let response = {
    text: '',
    intent: 'general',
    context: {}
  };
  
  // Check for booking intent
  if (lower.includes('book') || lower.includes('flight') || lower.includes('travel') || lower.includes('ticket')) {
    if (lower.includes('book') || lower.includes('flight')) {
      response.intent = 'booking';
      
      // Extract cities
      const cities = ['new york', 'london', 'paris', 'tokyo', 'singapore', 'sydney', 'dubai', 'mumbai', 'delhi', 'bangalore', 'chennai'];
      let origin = null, destination = null;
      
      cities.forEach(city => {
        if (lower.includes(city) && !origin) {
          origin = city;
        } else if (lower.includes(city) && origin) {
          destination = city;
        }
      });
      
      if (origin && destination) {
        response.text = `✈️ Great! Let me search for flights from ${origin} to ${destination}.\n\nI've found some options. Please use the search form to view all available flights and complete your booking.\n\nYou can also tell me your preferred travel date.`;
        response.context = { origin, destination };
      } else if (origin) {
        response.text = `✈️ You mentioned ${origin}. Where would you like to travel to?`;
        response.context = { origin };
      } else {
        response.text = `✈️ I can help you book a flight. Please tell me:\n- Your departure city\n- Your destination\n- Your travel date\n\nExample: "Book a flight from New York to London on July 15"`;
      }
    }
  }
  // Check for booking reference
  else if (lower.includes('booking') || lower.includes('reference') || lower.includes('pnr') || lower.includes('confirmation')) {
    const refMatch = message.match(/[A-Z0-9]{6,8}/i);
    const reference = refMatch ? refMatch[0] : null;
    
    if (reference) {
      const booking = await Booking.findOne({
        bookingReference: reference,
        user: userId
      });
      
      if (booking) {
        response.text = `📋 I found your booking:\n\n✈️ ${booking.flight.airline} ${booking.flight.flightNumber}\n📍 ${booking.flight.origin} → ${booking.flight.destination}\n📅 ${booking.flight.departureDate} at ${booking.flight.departureTime}\n💰 ${booking.flight.currency} ${booking.flight.price}\n📊 Status: ${booking.status}\n\nWould you like to cancel or modify this booking?`;
        response.context = { bookingReference: reference };
        response.intent = 'servicing';
      } else {
        response.text = `❌ I couldn't find any booking with reference ${reference}. Please check the reference and try again.`;
      }
    } else {
      response.text = `📋 I can help you with your bookings. Please provide your 6-digit booking reference (e.g., BK-123456) or tell me more about what you need.`;
    }
  }
  // Check for cancel
  else if (lower.includes('cancel') || lower.includes('refund')) {
    response.intent = 'servicing';
    response.text = `🔄 I can help you cancel a booking. Please provide your 6-digit booking reference (e.g., BK-123456) so I can look up your reservation.`;
  }
  // Check for my bookings
  else if (lower.includes('my booking') || lower.includes('my trips') || lower.includes('upcoming')) {
    const bookings = await Booking.find({ user: userId }).limit(3);
    
    if (bookings.length > 0) {
      let bookingText = '📋 Here are your recent bookings:\n\n';
      bookings.forEach((b, i) => {
        bookingText += `${i+1}. ${b.flight.airline} ${b.flight.flightNumber}\n`;
        bookingText += `   ${b.flight.origin} → ${b.flight.destination}\n`;
        bookingText += `   📅 ${b.flight.departureDate} | Status: ${b.status}\n`;
        bookingText += `   Reference: ${b.bookingReference}\n\n`;
      });
      bookingText += 'To manage a specific booking, provide the reference number.';
      response.text = bookingText;
      response.intent = 'servicing';
    } else {
      response.text = `📋 You don't have any bookings yet. Would you like to book a flight?`;
      response.intent = 'booking';
    }
  }
  // Greeting
  else if (lower.match(/^(hi|hello|hey|good morning|good evening|good afternoon)/)) {
    response.text = `👋 Hello! I'm your BlueWings travel assistant. How can I help you today?\n\nI can help with:\n• Booking flights\n• Viewing your bookings\n• Cancelling or modifying reservations\n• General inquiries`;
  }
  // Agent handoff
  else if (lower.includes('agent') || lower.includes('human') || lower.includes('speak to someone') || lower.includes('real person')) {
    response.text = `🔄 I understand you'd like to speak with a human agent. Let me connect you.\n\nIn the meantime, please describe your issue briefly so the agent can assist you better.`;
    response.intent = 'agent_handoff';
  }
  // Help
  else if (lower.includes('help') || lower.includes('what can you do')) {
    response.text = `💡 Here's what I can help you with:\n\n✈️ **Book a flight** - Tell me your origin, destination, and date\n📋 **View bookings** - Say "my bookings" or provide a reference\n🔄 **Cancel/Modify** - Provide your booking reference\n💬 **General questions** - Ask me anything about BlueWings\n👤 **Agent** - Say "agent" to speak with a human\n\nWhat would you like to do?`;
  }
  // Default
  else {
    response.text = `🤔 I understand you said "${message}". Let me help you with that.\n\nYou can:\n- Book a flight (say "book a flight")\n- View your bookings (say "my bookings")\n- Get help (say "help")\n- Speak to an agent (say "agent")\n\nHow can I assist you further?`;
  }
  
  return response;
}

module.exports = router;