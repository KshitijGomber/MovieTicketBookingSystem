import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Alert, 
  CircularProgress,
  Chip,
  Paper,
  Snackbar,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { EventSeat, ArrowBack, AccessTime, Star, AttachMoney } from '@mui/icons-material';
import { fetchShow } from '../api/shows';
import { getBookedSeats } from '../api/bookings';

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

  // Fetch show details
  const { data: show, isLoading, error } = useQuery({
    queryKey: ['show', params.id],
    queryFn: () => fetchShow(params.id)
  });

  // Fetch booked seats for the selected showtime
  const { data: bookedSeats = [], refetch: refetchBookedSeats } = useQuery({
    queryKey: ['bookedSeats', show?._id, selectedShowTime],
    queryFn: () => getBookedSeats(show?._id, selectedShowTime),
    enabled: !!(show?._id && selectedShowTime),
    onError: (error) => {
      console.error('Error fetching booked seats:', error);
      setSnackbar({
        open: true,
        message: 'Error loading seat availability',
        severity: 'error'
      });
    }
  });

  // Reset selected seats when showtime changes
  useEffect(() => {
    setSelectedSeats([]);
    if (selectedShowTime && show?._id) {
      refetchBookedSeats();
    }
  }, [selectedShowTime, show?._id, refetchBookedSeats]);
  
  // Calculate total price
  const { subtotal, tax, total, seatCount } = useMemo(() => {
    const price = parseFloat(show?.price) || 9.99;
    const subtotal = selectedSeats.length * price;
    const tax = subtotal * 0.1; // 10% tax
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2),
      seatCount: selectedSeats.length
    };
  }, [selectedSeats, show?.price]);

  const handleSeatClick = (seatId) => {
    if (!token) {
      setSnackbar({
        open: true,
        message: 'Please log in to select seats',
        severity: 'warning'
      });
      return;
    }
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBookNow = () => {
    if (!token) {
      setSnackbar({
        open: true,
        message: 'Please log in to book tickets',
        severity: 'warning'
      });
      return;
    }
    
    if (selectedSeats.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one seat',
        severity: 'warning'
      });
      return;
    }
    
    // Navigate to booking page with selected seats
    navigate(`/book/${show._id}`, {
      state: {
        showTime: selectedShowTime,
        seats: selectedSeats,
        totalPrice: total
      }
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const generateSeatLayout = () => {
    if (!show) return [];
    
    const totalSeats = 30; // 6 seats per row, 5 rows
    const seatsPerRow = 6;
    const totalRows = 5;
    const seats = [];
    
    for (let row = 1; row <= totalRows; row++) {
      const rowSeats = [];
      
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatId = String((row - 1) * seatsPerRow + seatNum); // Creates seat numbers 1-30
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        
        rowSeats.push(
          <Box
            key={seatId}
            onClick={() => !isBooked && handleSeatClick(seatId)}
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              cursor: isBooked ? 'not-allowed' : 'pointer',
              backgroundColor: isBooked 
                ? 'error.light' 
                : isSelected 
                  ? 'primary.main' 
                  : 'action.hover',
              color: isBooked || isSelected ? 'common.white' : 'text.primary',
              opacity: isBooked ? 0.7 : 1,
              '&:hover': !isBooked && {
                backgroundColor: isSelected ? 'primary.dark' : 'action.selected',
              },
              m: 0.5,
              position: 'relative',
            }}
          >
            <EventSeat />
            <Typography variant="caption" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
              {seatId}
            </Typography>
          </Box>
        );
      }
      
      seats.push(
        <Box key={`row-${row}`} display="flex" justifyContent="center" mb={1}>
          {rowSeats}
        </Box>
      );
    }
    
    return seats;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        Error loading show details: {error.message}
      </Alert>
    );
  }

  if (!show) {
    return (
      <Alert severity="warning" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        Show not found
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: { xs: 2, md: 4 },
      background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
      minHeight: '100vh'
    }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBack />}
        sx={{
          textTransform: 'none',
          mb: 3,
          color: 'primary.main',
          fontWeight: 600,
          px: 2,
          py: 1,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'white',
            transform: 'translateX(-4px)',
            boxShadow: 2,
          },
          transition: 'all 0.3s ease',
        }}
      >
        Back to Movies
      </Button>

      <Paper 
        elevation={4} 
        sx={{ 
          p: { xs: 2, md: 4 }, 
          borderRadius: 3, 
          mb: 4,
          background: 'white',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.04)'
        }}
      >
        <Grid container spacing={4}>
          {/* Movie Poster - Smaller and on the left */}
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              position: 'relative',
              '&:hover .movie-poster-overlay': { opacity: 1 },
              maxWidth: '300px',
              mx: 'auto'
            }}>
              <Box
                component="img"
                src={show.image || show.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={show.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Movie Details - On the right */}
          <Grid item xs={12} md={9}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  color: 'text.primary',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.2,
                  fontSize: { xs: '1.8rem', md: '2.125rem' }
                }}
              >
                {show.title}
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={1.5} mb={3}>
                <Chip 
                  icon={<AccessTime />} 
                  label={`${Math.floor(show.duration / 60)}h ${show.duration % 60}m`} 
                  size="small"
                  sx={{ 
                    '& .MuiChip-label': { px: 1 },
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    fontSize: '0.8rem'
                  }}
                />
                <Chip 
                  icon={<Star />} 
                  label={show.rating ? `${show.rating}/10` : 'N/A/10'}
                  size="small"
                  sx={{ 
                    '& .MuiChip-label': { px: 1 },
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    fontSize: '0.8rem'
                  }}
                />
                <Chip 
                  label={show.genre || 'Genre not specified'} 
                  size="small"
                  sx={{ 
                    '& .MuiChip-label': { px: 1 },
                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    fontSize: '0.8rem'
                  }}
                />
                <Chip 
                  label={show.language || 'English'} 
                  size="small"
                  sx={{ 
                    '& .MuiChip-label': { px: 1 },
                    backgroundColor: 'rgba(0, 151, 167, 0.1)',
                    fontSize: '0.8rem'
                  }}
                />
                <Chip 
                  icon={<AttachMoney />} 
                  label={`From $${show.ticketPrice || '12.99'}`} 
                  size="small"
                  color="success"
                  sx={{ 
                    '& .MuiChip-label': { px: 1 },
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    boxShadow: '0 2px 4px rgba(46, 125, 50, 0.2)'
                  }}
                />
              </Box>
              
              <Box 
                mb={4}
                sx={{
                  background: 'white',
                  p: 0,
                  borderRadius: 0,
                  borderLeft: 'none',
                  boxShadow: 'none',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    width: '60px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                    mb: 2,
                    borderRadius: '2px'
                  }
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    fontSize: '1.4rem',
                    mb: 2
                  }}
                >
                  About the Movie
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ 
                    color: 'text.secondary', 
                    lineHeight: 1.7, 
                    fontSize: '1rem',
                    mb: 3,
                    '&:first-letter': {
                      float: 'left',
                      fontSize: '2.5rem',
                      lineHeight: 1,
                      fontWeight: 'bold',
                      color: 'primary.main',
                      mr: 1,
                      mt: 0.5
                    }
                  }}
                >
                  {show.description || 'No description available.'}
                </Typography>
              </Box>

              <Box mt={6}>
                <Box 
                  sx={{
                    mt: 6,
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      width: '60px',
                      height: '4px',
                      background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                      mb: 2,
                      borderRadius: '2px'
                    }
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      fontSize: '1.4rem',
                      mb: 3
                    }}
                  >
                    Select Showtime & Seats
                  </Typography>
                </Box>

                {show.showTimes && show.showTimes.length > 0 ? (
                  <Box>
                    <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                      {show.showTimes.map((time, index) => (
                        <Button
                          key={index}
                          variant={selectedShowTime === time ? 'contained' : 'outlined'}
                          onClick={() => setSelectedShowTime(time)}
                          sx={{
                            minWidth: 100,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 2,
                              backgroundColor: 'primary.main',
                              color: 'white',
                            },
                            ...(selectedShowTime === time && {
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                            }),
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                    </Box>

                    {selectedShowTime && (
                      <Box>
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h6" gutterBottom>
                            Select Your Seats
                          </Typography>
                          
                          <Box sx={{ 
                            bgcolor: 'background.paper', 
                            p: 3, 
                            borderRadius: 2,
                            boxShadow: 1,
                            mb: 2
                          }}>
                            {/* Screen */}
                            <Box 
                              sx={{ 
                                width: '100%', 
                                height: 20, 
                                bgcolor: 'text.primary',
                                mb: 4,
                                color: 'background.paper',
                                textAlign: 'center',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px 4px 0 0'
                              }}
                            >
                              SCREEN
                            </Box>
                            
                            {/* Seats */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              {generateSeatLayout()}
                            </Box>
                            
                            {/* Legend */}
                            <Box display="flex" justifyContent="center" gap={4} mt={4}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <EventSeat sx={{ color: 'action.hover' }} />
                                <Typography variant="caption">Available</Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={1}>
                                <EventSeat sx={{ color: 'primary.main' }} />
                                <Typography variant="caption">Selected</Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={1}>
                                <EventSeat sx={{ color: 'error.light', opacity: 0.7 }} />
                                <Typography variant="caption">Booked</Typography>
                              </Box>
                            </Box>
                          </Box>
                          
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
                        
                        <Box>
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
                              fontSize: '1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 3
                              }
                            }}
                          >
                            {!token ? 'Sign In to Book' : 'Proceed to Payment'}
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
                    )}
                  </Box>
                ) : (
                  <Alert severity="info" sx={{ maxWidth: 500, mb: 3 }}>
                    No showtimes available. Please check back later.
                  </Alert>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShowDetails;
