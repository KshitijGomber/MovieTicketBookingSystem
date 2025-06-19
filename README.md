# Movie Ticket Booking System

A full-stack movie ticket booking application built with React, Node.js, and MongoDB.

## Features

- **Movie Shows**: Browse available movies with details
- **Seat Selection**: Interactive seat map with real-time availability
- **Multiple Seat Booking**: Select and book multiple seats at once
- **Authentication**: Auth0 integration for user login/logout
- **Booking Management**: View and cancel your bookings
- **Real-time Updates**: Seat availability updates in real-time

## Tech Stack

### Frontend
- React 18 with Vite
- Material-UI for components
- TanStack Query for API state management
- React Router for navigation
- Auth0 for authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication (configured but using temporary user IDs for demo)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Auth0 account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie_ticket_booking_system
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**
   ```
   MONGODB_URI=mongodb://localhost:27017/movie_booking
   PORT=3000
   JWT_SECRET=your_jwt_secret_here
   ```

   **Frontend (.env)**
   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_AUTH0_DOMAIN=your_auth0_domain
   VITE_AUTH0_CLIENT_ID=your_auth0_client_id
   VITE_AUTH0_AUDIENCE=your_auth0_audience
   ```

4. **Start the servers**

   **Backend (Terminal 1)**
   ```bash
   cd backend
   node app.js
   ```

   **Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173 (or the port shown in terminal)
   - Backend API: http://localhost:3000/api

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

## License

This project is licensed under the MIT License. 