# ✈️ BlueWings Airlines - Conversational Flight Booking System

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🎯 Project Overview

A complete **MERN Stack** implementation of a conversational flight booking and servicing platform, built for the **22North Product Engineering Challenge 2026**. This application features a **WhatsApp-style chat interface** that allows passengers to book flights, manage reservations, and handle customer service inquiries without calling a contact center.

### 🏆 Challenge Solved
**Challenge 2 – Conversational Booking & Servicing**  
*Customer: Global Airline (BlueWings Airlines)*

> *"Design an MVP that enables passengers to complete common booking and servicing journeys through WhatsApp and Progressive Web Apps instead of calling the contact centre."*

---

## ✨ Features

### 🤖 Conversational AI
- **WhatsApp-style chat interface** for natural interaction
- **Context-aware conversations** with intent detection
- **Real-time responses** powered by intelligent bot logic
- **Seamless agent handoff** when human intervention is needed

### ✈️ Flight Management
- **Search flights** by origin, destination, and date
- **Complete booking flow** with passenger details
- **View all bookings** with status tracking
- **Cancel bookings** with confirmation
- **Modify bookings** with flight changes

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **Password hashing** using bcrypt
- **Protected routes** with middleware
- **User profiles** with personal information

### 🎨 UI/UX Design
- **Mobile-first responsive design** with Tailwind CSS
- **WhatsApp-inspired** chat interface
- **Quick action buttons** for common tasks
- **Typing indicators** for realistic chat experience
- **Toast notifications** for user feedback

### 📱 Tech Features
- **Real-time updates** via API polling
- **Modular component architecture**
- **RESTful API design**
- **MongoDB database** with Mongoose ODM
- **Environment-based configuration**

---

## 🚀 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| Tailwind CSS | 3.3.2 | Styling |
| React Router DOM | 6.10.0 | Navigation |
| Axios | 1.3.4 | HTTP Client |
| React Scroll | 1.8.9 | Smooth Scrolling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime |
| Express.js | 4.18.2 | Web Framework |
| MongoDB | 7.x | Database |
| Mongoose | 7.0.3 | ODM |
| JWT | 9.0.0 | Authentication |
| Bcryptjs | 2.4.3 | Password Hashing |
| UUID | 9.0.0 | Unique IDs |

---

## 📁 Project Structure
Bluewings/
├── client/ # React Frontend
│ ├── public/
│ │ ├── index.html
│ │ └── favicon.ico
│ ├── src/
│ │ ├── components/ # React Components
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Chat.jsx
│ │ │ ├── FlightSearch.jsx
│ │ │ └── BookingsList.jsx
│ │ ├── context/ # Context Providers
│ │ │ └── AuthContext.js
│ │ ├── App.jsx
│ │ ├── App.css
│ │ ├── index.js
│ │ └── index.css
│ ├── package.json
│ ├── tailwind.config.js
│ └── postcss.config.js
│
├── server/ # Node.js Backend
│ ├── models/ # Database Models
│ │ ├── User.js
│ │ ├── Booking.js
│ │ └── Conversation.js
│ ├── routes/ # API Routes
│ │ ├── auth.js
│ │ ├── flights.js
│ │ ├── bookings.js
│ │ └── conversation.js
│ ├── middleware/ # Custom Middleware
│ │ └── auth.js
│ ├── server.js # Entry Point
│ ├── package.json
│ └── .env # Environment Variables
│
├── .gitignore
└── README.md

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)
- [Git](https://git-scm.com/) (for cloning)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Devarsh-soni-git/bluewings-flight-booking.git
cd bluewings-flight-booking

# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file
# Copy the content from .env.example and update values

# Start the server
npm run dev

# Open a new terminal
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start the development server
npm start

# Server Configuration
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/flight_booking
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/flight_booking

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key_change_this_to_something_secure
