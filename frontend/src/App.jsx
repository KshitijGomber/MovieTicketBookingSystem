import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useState } from 'react'
import './App.css'
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import LoginButton from './components/Auth/LoginButton';
import LogoutButton from './components/Auth/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

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
            element={isAuthenticated ? <BookingForm /> : <LoginButton />} 
          />
          <Route 
            path="/my-bookings" 
            element={isAuthenticated ? <MyBookings /> : <LoginButton />} 
          />
        </Routes>
      </Container>
    </>
  )
}

export default App
