# Copilot Instructions for BookYourMovie (Movie Ticket Booking System)

## Project Overview
- **Stack:** MERN (MongoDB, Express.js, React, Node.js)
- **Purpose:** Full-stack movie ticket booking system with user authentication, showtimes, seat selection, and booking management.
- **Frontend:** React (Vite, MUI, React Query, React Router)
- **Backend:** Node.js/Express, Mongoose ODM, JWT/Google OAuth, Auth0 integration

## Architecture & Data Flow
- **Frontend** (`frontend/`):
  - Main entry: `src/main.jsx`, root component: `src/App.jsx`
  - Pages: `src/pages/` (e.g., `BookingPage.jsx`, `BookingConfirmation.jsx`)
  - Components: `src/components/` (e.g., `ShowList.jsx`, `ShowDetails.jsx`, `SeatSelection.jsx`, `MyBookings.jsx`)
  - API calls: `src/api/` (e.g., `shows.js`, `bookings.js`, `auth.js`)
  - Auth context: `src/context/AuthContext.jsx`
- **Backend** (`backend/`):
  - Entry: `app.js`, server start: `bin/www`
  - Models: `models/` (`Show.js`, `Booking.js`, `User.js`)
  - Routes: `routes/` (`shows.js`, `bookings.js`, `auth.js`, etc.)
  - Middleware: `middleware/auth.js` (JWT/Google OAuth)
  - Utilities: `utils/` (email, payment)
  - Scripts: `scripts/` (data seeding, migration)

## Key Patterns & Conventions
- **API endpoints:**
  - `/api/shows` — list and details of shows (supports `?theaterId=` filter)
  - `/api/theaters` — CRUD operations for theaters
  - `/api/theaters/:id/shows` — shows for specific theater
  - `/api/bookings` — user bookings (protected, now includes theater references)
  - `/api/bookings/show/:showId/seats?showTime=&theaterId=` — booked seats for showtime at specific theater
- **Authentication:**
  - Uses Auth0 (production) or JWT/Google OAuth (local/dev)
  - Protected routes require valid JWT in `Authorization` header
- **Theater & Booking Logic:**
  - `Theater` model: Contains location, screens, amenities, contact info
  - `Show` model: Has `theaters` array with theater-specific showtimes and seat availability
  - `Booking` model: References `Show`, `User`, and `Theater` with seat and showtime
  - Seat selection validated server-side per theater to prevent double-booking
  - Bookings have status: `pending_payment`, `booked`, `cancelled`, `completed`
- **Frontend Data Fetching:**
  - Uses React Query for caching and refetching
  - API URLs are set via `VITE_API_URL` in `.env`
  - Theater selection component: `TheaterSelection.jsx`
- **Styling:**
  - Uses MUI components and custom CSS (`App.css`, `index.css`)

## Developer Workflows
- **Local dev:**
  - Backend: `cd backend && npm install && npm start` (or `node app.js`)
  - Frontend: `cd frontend && npm install && npm run dev`
- **Environment:**
  - Backend: `.env` for DB, JWT, Auth0, etc.
  - Frontend: `.env` for API URL
- **Testing:**
  - No formal test suite; use API endpoints with tools like Postman or `curl`
- **Deployment:**
  - Frontend: Vercel (`frontend/` root, `npm run build`)
  - Backend: Render (`backend/` root, `node app.js`)

## Integration Points
- **Auth0:** Used for authentication in production
- **MongoDB Atlas:** Cloud DB for production
- **Email:** Email confirmations via `utils/emailService.js` (stubbed in dev)
- **Payment:** Mocked in `utils/paymentService.js`

## Example: Booking Creation (Backend)
- Route: `POST /api/bookings`
- Expects: `{ showId, theaterId, seats, showTime, paymentDetails }`
- Validates theater-specific seat availability, processes payment, creates booking, sends email

## Example: Fetching Booked Seats (Backend)
- Route: `GET /api/bookings/show/:showId/seats?showTime=...&theaterId=...`
- Returns: Array of booked seat numbers for the given show, showtime, and theater

## Example: Theater Selection (Frontend)
- Component: `TheaterSelection.jsx` - dropdown for theater selection
- Updates showtimes based on selected theater
- Resets seat selection when theater changes

---

For new features, follow the patterns in `models/`, `routes/`, and `src/api/`. When adding cross-cutting features (e.g., theaters), update both backend models/routes and frontend API/components accordingly.
