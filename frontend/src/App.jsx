import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Alert } from '@mui/material';
import { useState, useEffect } from 'react'
import './App.css'
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import LoginButton from './components/Auth/LoginButton';
import LogoutButton from './components/Auth/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Please log in to access this page.
        </Alert>
        <LoginButton />
      </Container>
    );
  }
  return children;
};

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Store Auth0 user info in localStorage for the booking API
  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem('auth0_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth0_user');
    }
  }, [user, isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Movie Ticket Booking
          </Typography>
          <Button color="inherit" component={Link} to="/">Shows</Button>
          {isAuthenticated && (
            <Button color="inherit" component={Link} to="/my-bookings">My Bookings</Button>
          )}
          {isAuthenticated ? (
            <>
              <Typography sx={{ mx: 2 }}>{user.email || user.name}</Typography>
              <LogoutButton />
            </>
          ) : (
            <LoginButton />
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<ShowList />} />
          <Route path="/show/:showId" element={<ShowDetails />} />
          <Route 
            path="/booking/:showId" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BookingForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Container>
    </>
  )
}

export default App
