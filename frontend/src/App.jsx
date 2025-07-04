import { Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import './App.css';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import Payment from './components/Payment';
import BookingConfirmation from './components/BookingConfirmation';
import MyBookings from './components/MyBookings';
import LoginButton from './components/Auth/LoginButton';
import LogoutButton from './components/Auth/LogoutButton';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './context/AuthContext';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';


function App() {
  const { user, token } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getFirstName = () => {
    if (!user) return '';
    return user.username || user.name || user.email || '';
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
            
            {token ? (
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
      <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
        <Routes>
          <Route path="/" element={<ShowList />} />
          <Route path="/show/:showId" element={<ShowDetails />} />
          
          {/* Payment Flow */}
          <Route 
            path="/payment/:showId" 
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/confirmation" 
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            } 
          />
          
          {/* Old booking form (kept for backward compatibility) */}
          <Route 
            path="/booking/:showId" 
            element={
              token ? (
                <Navigate to={`/payment/showId`} replace />
              ) : (
                <Navigate to="/signin" state={{ from: window.location.pathname }} replace />
              )
            } 
          />
          
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          
          {/* Auth Routes */}
          <Route path="/signin" element={token ? <Navigate to="/" replace /> : <Signin />} />
          <Route path="/signup" element={token ? <Navigate to="/" replace /> : <Signup />} />
          <Route path="/forgot-password" element={token ? <Navigate to="/" replace /> : <ForgotPassword />} />
          <Route path="/reset-password" element={token ? <Navigate to="/" replace /> : <ResetPassword />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
