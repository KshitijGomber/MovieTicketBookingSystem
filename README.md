<div align="center">

# 🎬 BookYourMovie

### Modern Movie Ticket Booking System

*A full-stack web application built with the MERN stack, featuring real-time seat selection, secure authentication, and seamless booking management.*

---

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Material-UI](https://img.shields.io/badge/UI-Material--UI-007FFF?logo=mui)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)

### 🚀 [Live Demo](https://movie-ticket-booking-system-two.vercel.app) 

</div>

---

## 📖 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#-architecture)
- [🛠️ Tech Stack](#-tech-stack)
- [🎯 Core Functionality](#-core-functionality)
- [⚙️ Installation](#-installation)
- [🌐 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)
- [📱 Usage Guide](#-usage-guide)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Features

### 🎭 **Movie Management**
- **Browse Movies**: Comprehensive movie catalog with high-quality posters
- **Movie Details**: Detailed view with synopsis, genre, duration, and ratings
- **Real-time Updates**: Live movie data with instant synchronization
- **Search & Filter**: Advanced filtering by genre, language, and duration

### 🎟️ **Booking System**
- **Interactive Seat Selection**: Visual seat map with real-time availability
- **Multiple Seat Booking**: Select multiple seats in a single transaction
- **Theater Selection**: Choose from multiple theaters with different showtimes
- **Dynamic Pricing**: Flexible pricing based on seat type and theater
- **Booking Confirmation**: Instant confirmation with booking details

### 👤 **User Management**
- **Secure Authentication**: JWT-based auth with Google OAuth integration
- **User Profiles**: Personalized user experience with profile management
- **Booking History**: Complete history of past and upcoming bookings
- **Booking Management**: Cancel, modify, or view booking details
- **Personalized Dashboard**: Customized experience based on user preferences

### 🎨 **User Experience**
- **Responsive Design**: Seamless experience across all devices
- **Modern UI**: Material Design with smooth animations and transitions
- **Dark/Light Mode**: Theme switching for comfortable viewing
- **Progressive Loading**: Skeleton screens and optimized loading states
- **Real-time Feedback**: Instant visual feedback for all user actions

---

## 🏗️ Architecture

### 🏗️ System Architecture Overview

Our MERN stack application follows a modern three-tier architecture with clear separation of concerns:

```mermaid
graph TB
    subgraph "🎭 Frontend Layer (React)"
        A[User Interface] --> B[React Components]
        B --> C[React Query Cache]
        C --> D[API Client]
        B --> E[Auth Context]
        B --> F[Theme Context]
    end
    
    subgraph "⚙️ Backend Layer (Node.js)"
        G[Express Server] --> H[API Routes]
        H --> I[Controllers]
        I --> J[Auth Middleware]
        I --> K[Data Models]
    end
    
    subgraph "💾 Database Layer"
        L[(MongoDB Atlas)]
        M[Users Collection]
        N[Movies Collection]
        O[Theaters Collection]
        P[Bookings Collection]
    end
    
    subgraph "🔌 External Services"
        Q[Google OAuth]
        R[Email Service]
        S[Payment Gateway]
    end
    
    D -.->|HTTP Requests| G
    E -.->|Authentication| Q
    K -.->|Data Operations| L
    L --> M
    L --> N
    L --> O
    L --> P
    I -.->|Notifications| R
    I -.->|Payments| S
    
    style A fill:#e3f2fd
    style G fill:#fff8e1
    style L fill:#f3e5f5
    style Q fill:#e8f5e8
```

### 🔄 Data Flow Sequence

Here's how data flows through the system during a typical booking process:

```mermaid
sequenceDiagram
    participant 👤 as User
    participant 🎨 as Frontend
    participant 🔐 as Auth Service
    participant 🖥️ as Backend API
    participant 💾 as Database
    
    Note over 👤,💾: Movie Discovery Flow
    👤->>🎨: Browse Movies
    🎨->>🖥️: GET /api/shows
    🖥️->>💾: Query Movies Collection
    💾-->>🖥️: Movie Data
    🖥️-->>🎨: JSON Response
    🎨-->>👤: Display Movie Grid
    
    Note over 👤,💾: Booking Flow
    👤->>🎨: Select Movie & Seats
    🎨->>🔐: Authenticate User
    🔐-->>🎨: JWT Token
    🎨->>🖥️: POST /api/bookings (with JWT)
    🖥️->>🖥️: Validate JWT Token
    🖥️->>💾: Check Seat Availability
    💾-->>🖥️: Availability Status
    🖥️->>💾: Create Booking Record
    💾-->>🖥️: Booking Confirmation
    🖥️-->>🎨: Success Response
    🎨-->>👤: Booking Confirmed
```

### 📂 Project Structure

```
📦 MovieTicketBookingSystem
├── 🎨 frontend/                 # React Application
│   ├── 📱 src/
│   │   ├── 🧩 components/       # Reusable UI Components
│   │   ├── 📄 pages/           # Route-specific Pages
│   │   ├── 🔗 api/             # API Service Layer
│   │   ├── 🎯 context/         # React Context Providers
│   │   └── 🎨 assets/          # Static Assets
│   └── 📦 public/              # Public Static Files
│
├── ⚙️ backend/                  # Node.js API Server
│   ├── 📋 models/              # Database Schemas
│   ├── 🛣️ routes/              # API Route Handlers
│   ├── 🔒 middleware/          # Auth & Validation
│   ├── 🛠️ utils/               # Helper Functions
│   └── 📜 scripts/             # Database Scripts
│
└── 📚 docs/                    # Documentation
```

### 🔧 Component Architecture

#### **Frontend Components Hierarchy**
```
App.jsx (Root)
├── Header.jsx (Navigation)
├── HomePage.jsx
│   ├── Hero.jsx
│   ├── MovieGrid.jsx
│   └── Features.jsx
├── MovieDetailsPage.jsx
│   ├── ShowDetails.jsx
│   ├── TheaterSelection.jsx
│   └── SeatSelection.jsx
├── BookingPage.jsx
│   ├── BookingForm.jsx
│   └── PaymentModal.jsx
└── MyBookings.jsx
```

#### **Backend Route Structure**
```
/api
├── /shows          # Movie operations
├── /theaters       # Theater management
├── /bookings       # Booking operations
├── /auth           # Authentication
└── /users          # User management
```

---

## 🛠️ Tech Stack

### **Frontend Technologies**
| Technology | Purpose | Key Features |
|------------|---------|--------------|
| **React 19** | UI Framework | Component-based architecture, Hooks, Context API |
| **Material-UI v6** | UI Components | Pre-built components, Theming, Responsive design |
| **React Query** | State Management | Server state caching, Background updates, Optimistic updates |
| **React Router v6** | Navigation | Declarative routing, Protected routes, Nested routing |
| **Framer Motion** | Animations | Smooth transitions, Gesture handling, Page animations |
| **Vite** | Build Tool | Fast HMR, Optimized builds, ES modules |

### **Backend Technologies**
| Technology | Purpose | Key Features |
|------------|---------|--------------|
| **Node.js** | Runtime | JavaScript server-side execution, Event-driven |
| **Express.js** | Web Framework | RESTful APIs, Middleware support, Routing |
| **MongoDB** | Database | NoSQL, Document-based, Scalable |
| **Mongoose** | ODM | Schema validation, Query building, Middleware |
| **JWT** | Authentication | Stateless auth, Secure tokens, Role-based access |
| **bcryptjs** | Password Security | Password hashing, Salt rounds, Secure comparison |

### **Development & Deployment**
| Technology | Purpose |
|------------|---------|
| **ESLint** | Code Linting |
| **Prettier** | Code Formatting |
| **Vercel** | Frontend Deployment |
| **Render** | Backend Deployment |
| **MongoDB Atlas** | Database Hosting |

---

## 🎯 Core Functionality

### 🎬 **Movie Discovery & Selection**

#### **Movie Catalog**
- **Grid Layout**: Responsive movie grid with 3 cards per row on desktop
- **Movie Cards**: Compact cards featuring poster, title, genre, duration, and rating
- **Hover Effects**: Smooth animations with play button overlay
- **Real-time Data**: Live movie information with instant updates

#### **Movie Details Page**
- **Rich Information**: Synopsis, cast, director, and production details
- **Theater Integration**: Multiple theaters with location-specific showtimes
- **Visual Design**: Side-by-side poster and details layout
- **Interactive Elements**: Animated chips for genre, language, and pricing

### 🎟️ **Advanced Booking System**

#### **Theater Selection**
```javascript
// Theater Selection Component Features
- Multiple theater locations
- Theater-specific showtimes
- Amenities display (IMAX, Dolby, etc.)
- Distance and contact information
- Operating hours and facilities
```

#### **Seat Selection Interface**
- **Visual Seat Map**: Interactive grid showing all seats
- **Real-time Availability**: 
  - 🟢 Available seats
  - 🟡 Selected seats  
  - 🔴 Booked seats
- **Multi-seat Selection**: Select multiple seats in one booking
- **Seat Validation**: Server-side validation prevents double booking

#### **Booking Flow**
1. **Movie Selection** → Browse and select movie
2. **Theater & Time** → Choose theater and showtime  
3. **Seat Selection** → Pick available seats
4. **Authentication** → Login/register if needed
5. **Confirmation** → Review and confirm booking
6. **Success** → Booking confirmation with details

### 🔐 **Authentication & Security**

#### **Multi-Authentication Support**
- **JWT Authentication**: Stateless token-based auth
- **Google OAuth**: One-click social login
- **Email/Password**: Traditional registration with secure hashing
- **Protected Routes**: Secure access to booking features

#### **Security Features**
- **Password Encryption**: bcrypt with salt rounds
- **Token Validation**: JWT middleware for API protection
- **CORS Configuration**: Cross-origin request security
- **Input Validation**: Server-side data validation

### 📱 **User Experience Features**

#### **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced experience on tablets
- **Desktop Experience**: Full-featured desktop interface
- **Breakpoint System**: Material-UI responsive breakpoints

#### **Performance Optimization**
- **React Query Caching**: Intelligent data caching
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized poster loading
- **Code Splitting**: Route-based code splitting

---

## ⚙️ Installation

### 📋 **Prerequisites**

```bash
Node.js >= 18.0.0
npm >= 8.0.0
MongoDB >= 6.0.0
Git
```

### 🚀 **Quick Start**

#### **1. Clone Repository**
```bash
git clone https://github.com/KshitijGomber/MovieTicketBookingSystem.git
cd MovieTicketBookingSystem
```

#### **2. Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file
nano .env
```

**Backend Environment Variables (.env)**
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/movie_booking
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/movie_booking

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Service (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### **3. Frontend Setup**
```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file
nano .env
```

**Frontend Environment Variables (.env)**
```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Authentication (if using Auth0)
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=your_auth0_audience
```

#### **4. Database Setup**

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Create database
mongosh
use movie_booking
```

**Option B: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

#### **5. Run Application**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server running on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Application running on http://localhost:5173
```

### 🔧 **Development Commands**

```bash
# Backend
npm start          # Start server
npm run dev        # Start with nodemon
npm test           # Run tests
npm run seed       # Seed database with sample data

# Frontend  
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🌐 API Documentation

### **Base URL**
```
Development: http://localhost:3000/api
Production: https://your-backend-url.com/api
```

### **Authentication**
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### **Movies Endpoints**

#### **GET /api/shows**
Get all movies with optional filtering
```bash
curl -X GET "http://localhost:3000/api/shows?genre=Action&language=English"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "movie_id",
      "title": "Inception",
      "genre": ["Action", "Sci-Fi"],
      "language": "English",
      "duration": 148,
      "rating": 8.8,
      "image": "https://example.com/poster.jpg",
      "description": "Movie description...",
      "price": 12.99,
      "theaters": [
        {
          "theaterId": "theater_id",
          "showtimes": ["10:00", "13:30", "17:00", "20:30"],
          "availableSeats": 85
        }
      ]
    }
  ]
}
```

#### **GET /api/shows/:id**
Get specific movie details
```bash
curl -X GET "http://localhost:3000/api/shows/movie_id"
```

### **Theater Endpoints**

#### **GET /api/theaters**
Get all theaters
```bash
curl -X GET "http://localhost:3000/api/theaters"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "theater_id",
      "name": "Cineplex Downtown",
      "location": {
        "address": "123 Main St, City",
        "coordinates": [lat, lng]
      },
      "amenities": ["IMAX", "Dolby Atmos", "Parking"],
      "contactInfo": {
        "phone": "+1-234-567-8900",
        "email": "info@cineplex.com"
      },
      "screens": 12,
      "totalSeats": 150
    }
  ]
}
```

#### **GET /api/theaters/:id/shows**
Get shows for specific theater
```bash
curl -X GET "http://localhost:3000/api/theaters/theater_id/shows"
```

### **Booking Endpoints**

#### **POST /api/bookings**
Create new booking (Protected)
```bash
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "showId": "movie_id",
    "theaterId": "theater_id", 
    "seats": ["A1", "A2"],
    "showTime": "19:30",
    "paymentDetails": {
      "method": "card",
      "amount": 25.98
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "booking_id",
    "bookingNumber": "BK2024001",
    "userId": "user_id",
    "showId": "movie_id",
    "theaterId": "theater_id",
    "seats": ["A1", "A2"],
    "showTime": "19:30",
    "bookingDate": "2024-01-15T10:30:00Z",
    "status": "confirmed",
    "totalAmount": 25.98,
    "movie": {
      "title": "Inception",
      "poster": "poster_url"
    },
    "theater": {
      "name": "Cineplex Downtown"
    }
  }
}
```

#### **GET /api/bookings**
Get user's bookings (Protected)
```bash
curl -X GET "http://localhost:3000/api/bookings" \
  -H "Authorization: Bearer <token>"
```

#### **POST /api/bookings/:id/cancel**
Cancel booking (Protected)
```bash
curl -X POST "http://localhost:3000/api/bookings/booking_id/cancel" \
  -H "Authorization: Bearer <token>"
```

#### **GET /api/bookings/show/:showId/seats**
Get booked seats for specific show
```bash
curl -X GET "http://localhost:3000/api/bookings/show/movie_id/seats?showTime=19:30&theaterId=theater_id"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bookedSeats": ["A1", "A2", "B5", "C10"],
    "totalSeats": 150,
    "availableSeats": 146
  }
}
```

### **Authentication Endpoints**

#### **POST /api/auth/register**
Register new user
```bash
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "password": "securepassword123"
  }'
```

#### **POST /api/auth/login**
Login user
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### **GET /api/auth/google**
Google OAuth login
```bash
# Redirect to: http://localhost:3000/api/auth/google
```

---

## 🚀 Deployment

### **Production Deployment**

#### **Frontend Deployment (Vercel)**

1. **Prepare for Deployment**
```bash
cd frontend

# Build for production
npm run build

# Test production build locally
npm run preview
```

2. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_API_URL
# Enter your backend URL: https://your-backend-url.com
```

**Vercel Configuration (`vercel.json`)**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/.*",
      "dest": "/index.html"
    }
  ]
}
```

#### **Backend Deployment (Render/Railway/Heroku)**

**Option A: Render (Recommended)**
1. Connect GitHub repository
2. Configure build settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
   - **Environment**: Node.js
3. Add environment variables in Render dashboard
4. Deploy automatically on git push

**Option B: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

**Option C: Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Create Heroku app
heroku create your-app-name

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

#### **Database Setup (MongoDB Atlas)**

1. **Create Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Setup Cluster**
   - Create new M0 cluster (free)
   - Choose cloud provider and region
   - Create database user
   - Whitelist IP addresses (0.0.0.0/0 for global access)

3. **Connect Application**
   - Get connection string
   - Update production environment variables

#### **Environment Variables for Production**

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-backend-url.com
VITE_AUTH0_DOMAIN=your-production-auth0-domain
VITE_AUTH0_CLIENT_ID=your-production-auth0-client-id
```

**Backend (Production Environment)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie_booking
JWT_SECRET=super_secure_production_jwt_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=3000
```

### **Performance Optimization**

#### **Frontend Optimizations**
- ✅ Code splitting with React Router
- ✅ Image optimization and lazy loading
- ✅ React Query caching
- ✅ Bundle size optimization
- ✅ CDN deployment via Vercel

#### **Backend Optimizations**
- ✅ MongoDB indexing on frequently queried fields
- ✅ Response compression with gzip
- ✅ Rate limiting for API endpoints
- ✅ Efficient data aggregation pipelines
- ✅ Caching strategies for static data

---

## 📖 Usage Guide

### **For End Users**

#### **1. Browsing Movies**
1. Visit the homepage
2. Browse featured movies in the responsive grid
3. Click on any movie card to view details
4. Use the search and filter options

#### **2. Making a Booking**
1. **Select Movie**: Click on desired movie
2. **Choose Theater**: Select from available theaters
3. **Pick Showtime**: Choose convenient time slot
4. **Select Seats**: Click on available seats (green)
5. **Login/Register**: Authenticate if not logged in
6. **Confirm & Pay**: Review details and complete booking
7. **Confirmation**: Receive booking confirmation with details

#### **3. Managing Bookings**
1. **View Bookings**: Access "My Bookings" from user menu
2. **Booking Details**: Click on any booking for full details
3. **Cancel Booking**: Cancel tickets if needed (subject to cancellation policy)
4. **Download Tickets**: Get tickets for cinema entry

### **For Developers**

#### **Adding New Features**

**1. New API Endpoint**
```bash
# 1. Create model (if needed)
touch backend/models/NewFeature.js

# 2. Create route
touch backend/routes/newfeature.js

# 3. Register route in app.js
# app.use('/api/newfeature', newFeatureRoutes);

# 4. Create frontend API service
touch frontend/src/api/newfeature.js

# 5. Create React components
touch frontend/src/components/NewFeature.jsx
```

**2. Database Schema Changes**
```javascript
// 1. Update model in backend/models/
// 2. Create migration script in backend/scripts/
// 3. Run migration: node scripts/migrateNewFeature.js
// 4. Update seed data if needed
```

**3. UI Component Development**
```bash
# 1. Create component
touch frontend/src/components/NewComponent.jsx

# 2. Add to routing (if page component)
# Update frontend/src/App.jsx

# 3. Add to relevant parent components
# Update existing components as needed
```

#### **Testing Guide**

**Manual Testing Checklist**
- [ ] Movie browsing and filtering
- [ ] Theater selection and showtime display
- [ ] Seat selection functionality
- [ ] User authentication flow
- [ ] Booking creation and confirmation
- [ ] Booking management (view/cancel)
- [ ] Responsive design across devices
- [ ] Error handling and edge cases

**API Testing with cURL**
```bash
# Test movie endpoint
curl -X GET "http://localhost:3000/api/shows"

# Test protected booking endpoint
curl -X GET "http://localhost:3000/api/bookings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test booking creation
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"showId":"MOVIE_ID","theaterId":"THEATER_ID","seats":["A1"],"showTime":"19:30"}'
```

---

## 🤝 Contributing

We welcome contributions to improve the Movie Ticket Booking System! Here's how you can help:

### **Getting Started**

1. **Fork the Repository**
```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/MovieTicketBookingSystem.git
cd MovieTicketBookingSystem
```

2. **Create Feature Branch**
```bash
git checkout -b feature/amazing-new-feature
```

3. **Set Up Development Environment**
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### **Development Guidelines**

#### **Code Style**
- **Frontend**: Follow React best practices, use functional components with hooks
- **Backend**: Follow Express.js conventions, use async/await for promises
- **Naming**: Use camelCase for variables, PascalCase for components
- **Comments**: Add JSDoc comments for functions, explain complex logic

#### **Commit Messages**
```bash
# Use conventional commits
git commit -m "feat: add seat selection validation"
git commit -m "fix: resolve booking confirmation date format"
git commit -m "docs: update API documentation"
git commit -m "style: improve movie card responsive layout"
```

#### **Pull Request Process**
1. **Update Documentation**: Ensure README reflects your changes
2. **Test Thoroughly**: Test both frontend and backend changes
3. **Small PRs**: Keep changes focused and reviewable
4. **Describe Changes**: Provide clear PR description with screenshots

### **Areas for Contribution**

#### **🐛 Bug Fixes**
- Seat selection edge cases
- Mobile responsiveness issues
- API error handling improvements
- Performance optimizations

#### **✨ New Features**
- **Advanced Filtering**: Genre, language, rating filters
- **Payment Integration**: Stripe/PayPal integration
- **Email Notifications**: Booking confirmations and reminders
- **User Profiles**: Enhanced user management
- **Admin Panel**: Theater and movie management
- **Mobile App**: React Native implementation

#### **📖 Documentation**
- API documentation improvements
- Component documentation
- Deployment guides
- Video tutorials

#### **🧪 Testing**
- Unit tests with Jest
- Integration tests
- E2E tests with Cypress
- Performance testing

### **Issue Reporting**

When reporting bugs, please include:
- **Environment**: OS, browser, Node.js version
- **Steps to Reproduce**: Clear reproduction steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Console Logs**: Any error messages

**Issue Template:**
```markdown
**Bug Description**
Brief description of the issue

**Environment**
- OS: macOS Monterey
- Browser: Chrome 120.0
- Node.js: 18.17.0

**Steps to Reproduce**
1. Go to movie details page
2. Select theater
3. Click on seat
4. See error

**Expected Result**
Seat should be selected

**Actual Result**
Error message appears

**Screenshots**
[Attach screenshot]
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**

✅ **Permissions**
- ✓ Commercial use
- ✓ Distribution  
- ✓ Modification
- ✓ Private use

❌ **Limitations**
- ✗ Liability
- ✗ Warranty

⚠️ **Conditions**
- License and copyright notice

### **Full License Text**
```
MIT License

Copyright (c) 2024 Kshitij Gomber

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### **Technologies & Libraries**
- **[React](https://reactjs.org/)** - Frontend framework for building user interfaces
- **[Node.js](https://nodejs.org/)** - Backend runtime environment
- **[Express.js](https://expressjs.com/)** - Web application framework for Node.js
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database for data storage
- **[Material-UI](https://mui.com/)** - React component library for design system
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[React Query](https://tanstack.com/query)** - Data fetching and caching library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for React

### **Inspiration & Resources**
- **BookMyShow** - User experience inspiration for booking flow
- **Fandango** - UI/UX reference for movie discovery
- **Cinema booking systems** - Real-world booking logic implementation
- **Material Design** - Design principles and component patterns

### **Development Tools**
- **[VS Code](https://code.visualstudio.com/)** - Primary development environment
- **[Postman](https://www.postman.com/)** - API testing and documentation
- **[MongoDB Compass](https://www.mongodb.com/products/compass)** - Database visualization
- **[Vercel](https://vercel.com/)** - Frontend deployment platform
- **[Render](https://render.com/)** - Backend deployment platform

### **Community & Support**
- **Stack Overflow** - Problem-solving and debugging assistance
- **React Community** - Component patterns and best practices
- **Express.js Community** - Backend architecture guidance
- **MongoDB University** - Database design principles

---

## 📞 Support & Contact

### **Getting Help**

#### **Documentation**
- 📖 **README**: Comprehensive setup and usage guide
- 🔗 **API Docs**: Detailed endpoint documentation above
- 🎯 **Architecture**: System design and data flow diagrams

#### **Community Support**
- 🐛 **Issues**: [GitHub Issues](https://github.com/KshitijGomber/MovieTicketBookingSystem/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/KshitijGomber/MovieTicketBookingSystem/discussions)
- 📧 **Email**: kshitijgomber@example.com

### **Reporting Issues**
When reporting issues, please include:
1. **Environment details** (OS, Node.js version, browser)
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Screenshots or logs** if applicable

### **Feature Requests**
We welcome feature suggestions! Please:
1. Check existing issues for duplicates
2. Provide detailed description and use cases
3. Include mockups or examples if possible

---

<div align="center">

### **⭐ If this project helped you, please consider giving it a star!**

**Made with ❤️ by [Kshitij Gomber](https://github.com/KshitijGomber)**

**Happy Coding! 🎬🍿**

</div>

## 🚀 Deployment

### Frontend (Vercel)
- Set the project root to `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Set environment variables in the Vercel dashboard

### Backend (Render)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `node app.js`
- Set environment variables in the Render dashboard

### MongoDB Atlas
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Whitelist Render’s IPs or use `0.0.0.0/0` for testing
- Use the provided connection string in your backend `.env`


## 🛠️ Common Deployment Issues

- **CORS Errors:**  
  Ensure `FRONTEND_URL` in backend env does NOT have a trailing slash and matches your deployed frontend exactly.

- **SPA Routing 404s on Vercel:**  
  Add a `vercel.json` file with:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/" }
    ]
  }
  ```

- **Auth0 Callback Errors:**  
  Make sure your Auth0 dashboard has the correct callback, logout, and web origin URLs for your deployed frontend.



## Usage

### For Users

1. **Browse Shows**: Visit the homepage to see all available movies
2. **Select a Show**: Click on any movie to view details
3. **Choose Showtime**: Select your preferred showtime from the dropdown
4. **Select Seats**: Click on available seats (green) to select them
   - Selected seats turn yellow
   - Booked seats are red
   - You can select multiple seats
5. **Login**: Click "Login to Book" to authenticate with Auth0
6. **Confirm Booking**: After login, click "Book X Seats" to confirm
7. **View Bookings**: Go to "My Bookings" to see all your reservations
8. **Cancel Bookings**: Cancel any booking from the My Bookings page

### For Developers

#### API Endpoints

- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get specific show
- `POST /api/bookings` - Create a booking
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings/:id/cancel` - Cancel a booking
- `GET /api/bookings/show/:showId/seats` - Get booked seats for a show

#### Database Models

- **Show**: Movie information, showtimes, available seats
- **Booking**: User bookings with seat, showtime, and status

## Current Status

✅ **Working Features:**
- Movie listing and details
- Seat selection with real-time availability
- Multiple seat booking
- Booking creation and storage
- Booking cancellation
- User authentication (Auth0)
- Protected routes

⚠️ **Temporary Implementation:**
- Using temporary user IDs instead of full Auth0 JWT integration
- Basic error handling
- Simple pricing ($10 per seat)

🔄 **Future Enhancements:**
- Full Auth0 JWT integration
- Payment processing
- Email confirmations
- Admin panel for managing shows
- Advanced seat selection (aisles, premium seats)
- Movie ratings and reviews

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **MongoDB connection issues**
   - Ensure MongoDB is running
   - Check connection string in backend .env

3. **Auth0 configuration**
   - Verify Auth0 domain, client ID, and audience in frontend .env
   - Check Auth0 application settings

4. **Frontend not loading**
   - Check if backend is running on port 3000
   - Verify API URL in frontend .env

### Development Commands

```bash
# Backend
cd backend
npm install
node app.js

# Frontend
cd frontend
npm install
npm run dev

# Test API
curl http://localhost:3000/api/shows
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🙏 Acknowledgements

- [Vercel](https://vercel.com/)
- [Render](https://render.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Auth0](https://auth0.com/)
- [Material-UI](https://mui.com/)


## License

This project is licensed under the MIT License. 