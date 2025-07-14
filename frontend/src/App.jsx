import { Routes, Route, Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Alert, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import './App.css';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import MyBookings from './components/MyBookings';
import LoginButton from './components/Auth/LoginButton';
import LogoutButton from './components/Auth/LogoutButton';
import { AccountCircle, Movie, Home, ConfirmationNumber } from '@mui/icons-material';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './context/AuthContext';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import HomePage from './pages/HomePage';
import MovieListPage from './pages/MovieListPage';
import MovieDetailsPage from './pages/MovieDetailsPage';

// Redirect component for legacy URLs
const ShowRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/movies/${id}`} replace />;
};

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

            {/* Navigation Links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                startIcon={<Home />}
                sx={{ mr: 2 }}
              >
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/movies"
                color="inherit"
                startIcon={<Movie />}
                sx={{ mr: 2 }}
              >
                Movies
              </Button>
              {token && (
                <Button
                  component={RouterLink}
                  to="/my-bookings"
                  color="inherit"
                  startIcon={<ConfirmationNumber />}
                  sx={{ mr: 2 }}
                >
                  My Bookings
                </Button>
              )}
            </Box>
            
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
      <Container sx={{ mt: '80px' }}>
        <Routes>
          {/* New Page Structure */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MovieListPage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          
          {/* Legacy routes - redirect to new structure */}
          <Route path="/shows" element={<Navigate to="/movies" replace />} />
          <Route path="/shows/:id" element={<ShowRedirect />} />
          <Route path="/show/:id" element={<ShowRedirect />} />
          
          {/* Booking Flow */}
          <Route path="/book/:showId" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          
          <Route path="/booking-confirmation/:bookingId" element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          } />
          
          <Route path="/signin" element={token ? <Navigate to="/" /> : <Signin />} />
          <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="*" element={
            <Container>
              <Alert severity="error">
                <Typography variant="h4">404 - Page Not Found</Typography>
                <Button component={RouterLink} to="/" sx={{ mt: 2 }}>Go to Home</Button>
              </Alert>
            </Container>
          } />
        </Routes>
      </Container>
    </>
  );
}

export default App;
