import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Alert, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react'
import './App.css'
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import LoginButton from './components/Auth/LoginButton';
import LogoutButton from './components/Auth/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';
import { AccountCircle } from '@mui/icons-material';

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
  console.log("🔥 VITE_API_URL:", import.meta.env.VITE_API_URL);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const getFirstName = () => {
    if (!user) return '';
    return user.given_name || user.nickname || user.name.split(' ')[0];
  };

  return (
    <>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        backgroundColor: 'rgba(245, 245, 245, 0.8)', 
        backdropFilter: 'blur(10px)',
        color: '#333' 
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="BookYourMovie Logo" style={{ height: 40, marginRight: 16 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: '#E50914',
                  textDecoration: 'none',
                }}
              >
                BookYourMovie
              </Typography>
            </RouterLink>

            <Box sx={{ flexGrow: 1 }} />
            
            {isAuthenticated ? (
              <div>
                <Button
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                  endIcon={<AccountCircle />}
                >
                  Hi, {getFirstName()}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem component={RouterLink} to="/my-bookings" onClick={handleClose}>My Bookings</MenuItem>
                  <LogoutButton variant="menuitem" />
                </Menu>
              </div>
            ) : (
              <LoginButton />
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ mt: '80px' }}>
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
