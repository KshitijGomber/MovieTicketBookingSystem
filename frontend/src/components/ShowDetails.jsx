import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Debug function
const debug = (message, data) => {
  console.log(`[DEBUG] ${message}`, data || '');
  return data;
};

import { fetchShow } from '../api/shows';
import { getBookedSeats } from '../api/bookings';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Alert, 
  CircularProgress,
  Chip,
  Paper,
  Breadcrumbs,
  Snackbar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Movie, EventSeat, ArrowBack } from '@mui/icons-material';

const ShowDetails = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useAuth();
  const [selectedShowTime, setSelectedShowTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });
  
  // Calculate total price
  const calculateTotal = () => {
    const subtotal = selectedSeats.length * 10; // $10 per seat
    const tax = subtotal * 0.1; // 10% tax
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2),
      seatCount: selectedSeats.length
    };
  };
  
  const { subtotal, tax, total, seatCount } = calculateTotal();

  // Extract and validate showId
  const showId = useMemo(() => {
    // Try multiple ways to get the showId
    const idFromParams = params?.showId || 
                        new URLSearchParams(location.search).get('showId') ||
                        location.pathname.split('/').pop();
    
    debug('Raw showId from URL:', idFromParams);
    
    if (!idFromParams) {
      console.error('No showId found in URL');
      return null;
    }
    
    const id = String(idFromParams).trim();
    
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error('Invalid showId format:', id);
      return null;
    }
    
    debug('Valid showId:', id);
    return id;
  }, [params, location]);

  // Handle missing or invalid showId
  useEffect(() => {
    if (!showId) {
      console.error('Invalid or missing showId, redirecting to home...');
      setSnackbar({
        open: true,
        message: 'Invalid show ID. Redirecting to home page...',
        severity: 'error'
      });
      
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showId, navigate]);

  // Format time to 12-hour format with AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return 'Select a showtime';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString; // Return original if formatting fails
    }
  };

  // Check for showTime in URL params
  useEffect(() => {
    const showTimeParam = searchParams.get('showTime');
    if (showTimeParam) {
      setSelectedShowTime(formatTime(showTimeParam));
    }
  }, [searchParams]);

  // Fetch show details
  const { 
    data: show, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['show', showId],
    queryFn: async () => {
      if (!showId) {
        throw new Error('No show ID provided');
      }
      
      debug('Fetching show with ID:', showId);
      
      try {
        const response = await fetch(`https://movieticketbookingsystem-7suc.onrender.com/api/shows/${showId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          cache: 'no-store' // Modern way to prevent caching
        });
        
        debug('API Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch show (${response.status})`);
        }
        
        const data = await response.json();
        debug('Fetched show data:', data);
        
        if (!data || !data._id) {
          throw new Error('Invalid show data received');
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching show:', error);
        throw error;
      }
    },
    enabled: !!showId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Show fetch error:', error);
      setSnackbar({
        open: true,
        message: `Error loading show: ${error.message}`,
        severity: 'error'
      });
    },
    onSuccess: (data) => {
      debug('Successfully loaded show:', { id: data._id, title: data.title });
    }
  });

  const { data: bookedSeatsData, isLoading: isLoadingSeats } = useQuery({
    queryKey: ['bookedSeats', showId, selectedShowTime],
    queryFn: () => getBookedSeats(showId, selectedShowTime),
    enabled: !!selectedShowTime,
    onError: (error) => {
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to load seat availability', 
        severity: 'error' 
      });
    }
  });

  const handleBookNow = () => {
    if (!selectedShowTime) {
      setSnackbar({ open: true, message: 'Please select a show time', severity: 'warning' });
      return;
    }
    
    if (selectedSeats.length === 0) {
      setSnackbar({ open: true, message: 'Please select at least one seat', severity: 'warning' });
      return;
    }
    
    // Calculate total price
  const calculateTotal = () => {
    const subtotal = selectedSeats.length * 10; // $10 per seat
    const tax = subtotal * 0.1; // 10% tax
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2),
      seatCount: selectedSeats.length
    };
  };  
    navigate(`/book/${showId}?${params.toString()}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSeatSelection = (seatId) => {
    // Check if user is authenticated
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      // Store the current URL to redirect back after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }
    
    // If authenticated, proceed with seat selection
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleSeatClick = (seatNumber) => {
    if (!token) {
      setSnackbar({
        open: true,
        message: 'Please log in to select seats',
        severity: 'warning'
      });
      // Don't navigate, just show the message
      return;
    }
    
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" my={4}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          Loading show details...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    console.error('Error loading show:', error);
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Error loading show details
          </Typography>
          <Typography variant="body2">
            {error.message || 'Please check your connection and try again.'}
          </Typography>
        </Alert>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Back to Shows
        </Button>
      </Box>
    );
  }

  if (!show) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Show Not Found
          </Typography>
          <Typography variant="body2">
            The show you're looking for doesn't exist or may have been removed.
          </Typography>
        </Alert>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Back to Shows
        </Button>
      </Box>
    );
  }

  const availableSeats = 30 - (bookedSeatsData?.bookedSeats?.length || 0);
  const isShowFull = availableSeats <= 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBack />} 
          color="inherit"
          size="small"
        >
          Back to Movies
        </Button>
      </Breadcrumbs>

      {isShowFull && selectedShowTime && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          This showtime is fully booked. Please select another time.
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 500,
              objectFit: 'contain',
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: 'background.paper',
              p: 2
            }}
            image={show.movie?.poster || '/placeholder-poster.jpg'}
            alt={show.movie?.title || 'Movie poster'}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
          
          {token && selectedShowTime && (
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              onClick={handleBookNow}
              disabled={isShowFull || selectedSeats.length === 0}
              sx={{ 
                py: 1.5, 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'text.disabled'
                }
              }}
              startIcon={<EventSeat />}
            >
              {isShowFull ? 'Fully Booked' : selectedSeats.length > 0 ? `Book ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}` : 'Select Seats'}
            </Button>
          )}
          
          {!token && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Please sign in to book tickets
            </Alert>
          )}
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography variant="h3" gutterBottom>
            {show.movie?.title || 'Movie Title'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip label={show.movie?.genre} variant="outlined" />
            <Chip label={`${show.movie?.duration} min`} variant="outlined" />
            <Chip label={show.movie?.rating} variant="outlined" />
            <Chip 
              label={`Rating: ${show.movie?.rating || 'N/A'}/10`} 
              color="primary" 
              variant="outlined" 
              icon={<Movie fontSize="small" />}
            />
          </Box>
          
          <Typography variant="h5" gutterBottom>About the Movie</Typography>
          <Typography paragraph sx={{ mb: 3 }}>{show.description}</Typography>
          
          <Box sx={{ mt: 4, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Showtime
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {show.timings?.length > 0 ? (
                show.timings.map((time, index) => (
                  <Button
                    key={index}
                    variant={selectedShowTime === time ? 'contained' : 'outlined'}
                    onClick={() => setSelectedShowTime(time)}
                    sx={{
                      minWidth: 100,
                      '&.MuiButton-contained': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        }
                      }
                    }}
                  >
                    {formatTime(time)}
                  </Button>
                ))
              ) : (
                <Typography color="text.secondary">No showtimes available</Typography>
              )}
            </Box>
          </Box>
          
          {selectedShowTime && (
            <>
              <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Select Seats {selectedSeats.length > 0 && `(${selectedSeats.length} selected)`}
                </Typography>
                {!token && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Please log in to select seats
                  </Alert>
                )}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: 'repeat(4, 1fr)', sm: 'repeat(8, 1fr)' },
                  gap: 1,
                  mb: 2,
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((seatNum) => {
                    const isBooked = bookedSeatsData?.bookedSeats?.includes(seatNum);
                    return (
                      <Button
                        key={seatNum}
                        variant="outlined"
                        color={isBooked ? 'error' : selectedSeats.includes(seatNum) ? 'success' : 'primary'}
                        disabled={isBooked}
                        onClick={() => handleSeatClick(seatNum)}
                        sx={{
                          minWidth: '40px',
                          bgcolor: isBooked ? 'error.light' : selectedSeats.includes(seatNum) ? 'success.light' : 'background.paper',
                          '&:hover': {
                            bgcolor: isBooked ? 'error.light' : selectedSeats.includes(seatNum) ? 'success.dark' : 'action.hover',
                          },
                        }}
                      >
                        {seatNum}
                      </Button>
                    );
                  })}
                </Box>
                
                <Box sx={{ 
                  mt: 4, 
                  p: 3, 
                  bgcolor: 'background.paper', 
                  borderRadius: 2, 
                  boxShadow: 1,
                  position: 'sticky',
                  top: 20
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Order Summary
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: 1, 
                        overflow: 'hidden',
                        mr: 2,
                        flexShrink: 0
                      }}>
                        <img 
                          src={show.movie?.poster || '/placeholder-poster.jpg'} 
                          alt={show.movie?.title || 'Movie poster'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-poster.jpg';
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {show.movie?.title || 'Movie Title'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {show.theater?.name || 'Theater'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {show.date ? formatDate(show.date) : 'Date not available'}
                          {selectedShowTime && ` • ${formatTime(selectedShowTime)}`}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {seatCount} {seatCount === 1 ? 'Ticket' : 'Tickets'}
                      </Typography>
                      <Box sx={{ 
                        bgcolor: 'background.default', 
                        p: 1.5, 
                        borderRadius: 1,
                        mb: 1
                      }}>
                        <Typography variant="body2">
                          {selectedSeats.length > 0 
                            ? `Seat${selectedSeats.length > 1 ? 's' : ''}: ${selectedSeats.join(', ')}`
                            : 'No seats selected'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Subtotal ({seatCount} {seatCount === 1 ? 'ticket' : 'tickets'})</Typography>
                      <Typography variant="body2">${subtotal}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Taxes & Fees</Typography>
                      <Typography variant="body2">${tax}</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>${total}</Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!selectedShowTime || selectedSeats.length === 0 || !token}
                    onClick={handleBookNow}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    {!token ? 'Log In to Book' : 'Proceed to Payment'}
                  </Button>
                  
                  {!token && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'block', 
                        mt: 1,
                        textAlign: 'center',
                        fontSize: '0.75rem'
                      }}
                    >
                      You need to be logged in to book tickets
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShowDetails; 