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
    if (!timeString) return '';
    
    // If it's already in the correct format, return as is
    if (typeof timeString === 'string' && /\d{1,2}:\d{2} [AP]M/.test(timeString)) {
      return timeString;
    }
    
    // If it's a Date object or ISO string, format it
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return timeString; // Return as is if not a valid date
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
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
    
    // Navigate to the booking page with show time and selected seats
    const params = new URLSearchParams({
      showTime: selectedShowTime,
      seats: selectedSeats.join(',')
    });
    
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
          <img
            src={show.posterUrl || 'https://via.placeholder.com/300x450'}
            alt={show.title}
            style={{ 
              width: '100%', 
              borderRadius: 8, 
              boxShadow: 3,
              marginBottom: 16,
              aspectRatio: '2/3',
              objectFit: 'cover'
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
            {show.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip label={show.language} variant="outlined" />
            <Chip label={`${show.duration} min`} variant="outlined" />
            <Chip label={show.genre} variant="outlined" />
            <Chip 
              label={`Rating: ${show.rating || 'N/A'}/10`} 
              color="primary" 
              variant="outlined" 
              icon={<Movie fontSize="small" />}
            />
          </Box>
          
          <Typography variant="h5" gutterBottom>About the Movie</Typography>
          <Typography paragraph sx={{ mb: 3 }}>{show.description}</Typography>
          
          <Typography variant="h5" gutterBottom>Show Times</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {show.showTimes?.map((time) => {
              const formattedTime = formatTime(time);
              return (
                <Button
                  key={formattedTime}
                  variant={selectedShowTime === formattedTime ? 'contained' : 'outlined'}
                  color={selectedShowTime === formattedTime ? 'primary' : 'inherit'}
                  onClick={() => setSelectedShowTime(formattedTime)}
                  sx={{
                    minWidth: 120,
                    py: 1.5,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  {formattedTime}
                </Button>
              );
            })}
          </Box>
          
          {selectedShowTime && (
            <>
              <Typography variant="h5" gutterBottom>Seat Map</Typography>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gap: 1,
                  mb: 3
                }}>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((seatNum) => {
                    const isBooked = bookedSeatsData?.bookedSeats?.includes(seatNum);
                    return (
                      <Button
                        key={seatNum}
                        variant="outlined"
                        color={isBooked ? 'error' : selectedSeats.includes(seatNum) ? 'success' : 'primary'}
                        disabled={isBooked}
                        onClick={() => handleSeatSelection(seatNum)}
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
                
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: 'primary.main', borderRadius: 1 }} />
                    <Typography variant="body2">Available</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: 'success.main', borderRadius: 1 }} />
                    <Typography variant="body2">Selected ({selectedSeats.length})</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: 'error.light', borderRadius: 1 }} />
                    <Typography variant="body2">Booked</Typography>
                  </Box>
                </Box>
              </Paper>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h6">
                  Available Seats: {availableSeats} of 30
                </Typography>
                {isShowFull && (
                  <Chip 
                    label="Fully Booked" 
                    color="error" 
                    variant="outlined" 
                    size="small" 
                  />
                )}
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