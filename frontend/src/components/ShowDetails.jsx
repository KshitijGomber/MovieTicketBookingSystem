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
import { EventSeat, ArrowBack, AccessTime, Star, AttachMoney, Close } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { createBooking, processPayment } from '../api/bookings';
import { fetchShow } from '../api/shows';
import { getBookedSeats } from '../api/bookings';
import { getTheatersForMovie } from '../api/theaters';
import TheaterSelection from './TheaterSelection';

const ShowDetails = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token, user } = useAuth();
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
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

  // Fetch theaters for this movie
  const { data: theaters, isLoading: isLoadingTheaters } = useQuery({
    queryKey: ['theaters', params.id],
    queryFn: () => getTheatersForMovie(params.id),
    enabled: !!params.id
  });

  // Fetch booked seats for the selected showtime
  const { data: bookedSeatsResponse, refetch: refetchBookedSeats } = useQuery({
    queryKey: ['bookedSeats', selectedShowtime?._id],
    queryFn: async () => {
      try {
        if (!selectedShowtime) return [];
        const response = await getBookedSeats(selectedShowtime.show, selectedShowtime.showTime);
        // Ensure we always return an array, even if the response is malformed
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Error in getBookedSeats:', error);
        return [];
      }
    },
    enabled: !!selectedShowtime,
    onError: (error) => {
      console.error('Error in booked seats query:', error);
      setSnackbar({
        open: true,
        message: 'Error loading seat availability',
        severity: 'error'
      });
    }
  });

  // Ensure bookedSeats is always an array
  const bookedSeats = Array.isArray(bookedSeatsResponse) ? bookedSeatsResponse : [];

  // Reset selected seats and refetch booked seats when showtime changes or component mounts
  useEffect(() => {
    // If we have a showtime, fetch the latest booked seats
    if (selectedShowtime) {
      console.log('Refreshing booked seats for showtime:', selectedShowtime._id);
      refetchBookedSeats()
        .then(() => console.log('Booked seats refreshed successfully'))
        .catch(err => console.error('Error refreshing booked seats:', err));
    } else {
      console.log('No showtime selected for fetching booked seats');
    }
    
    // Clear any selected seats when showtime changes
    setSelectedSeats([]);
  }, [selectedShowtime, refetchBookedSeats]);
  
  // Calculate total price
  const { subtotal, tax, total, seatCount } = useMemo(() => {
    const price = selectedShowtime?.price?.base || parseFloat(show?.price) || 10;
    if (isNaN(price)) {
      console.error('Invalid price value:', price);
      return {
        subtotal: '0.00',
        tax: '0.00',
        total: '0.00',
        seatCount: 0
      };
    }
    const subtotal = selectedSeats.length * price;
    const tax = subtotal * 0.1; // 10% tax
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2),
      seatCount: selectedSeats.length,
      pricePerSeat: price
    };
  }, [selectedSeats, selectedShowtime, show?.price]);

  const handleTheaterSelect = (theater) => {
    setSelectedTheater(theater);
    setSelectedSeats([]); // Clear selected seats when theater changes
  };

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]); // Clear selected seats when showtime changes
  };

  const handleSeatClick = (seatId) => {
    try {
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Please log in to select seats',
          severity: 'warning'
        });
        return;
      }

      if (!selectedShowtime) {
        setSnackbar({
          open: true,
          message: 'Please select a theater and showtime first',
          severity: 'warning'
        });
        return;
      }
      
      // Ensure seatId is a string for consistent comparison
      const seatIdStr = String(seatId);
      
      // Check if seat is already booked
      if (bookedSeats.includes(seatIdStr)) {
        setSnackbar({
          open: true,
          message: 'This seat is already booked',
          severity: 'warning'
        });
        return;
      }
      
      setSelectedSeats(prev => {
        // Ensure prev is an array
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.includes(seatIdStr)
          ? prevArray.filter(id => id !== seatIdStr)
          : [...prevArray, seatIdStr];
      });
    } catch (error) {
      console.error('Error in handleSeatClick:', error);
      setSnackbar({
        open: true,
        message: 'Error selecting seat. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleBookNow = () => {
    if (!selectedShowtime) {
      setSnackbar({
        open: true,
        message: 'Please select a theater and showtime',
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
    
    setIsPaymentOpen(true);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Ensure we have a valid price before proceeding
      const pricePerSeat = parseFloat(show?.price);
      if (isNaN(pricePerSeat) || pricePerSeat <= 0) {
        throw new Error('Invalid show price. Please try again later.');
      }

      // Calculate the total amount including tax
      const subtotal = selectedSeats.length * pricePerSeat;
      const tax = subtotal * 0.1; // 10% tax
      const totalAmount = subtotal + tax;

      // Process the payment with the calculated amount
      const paymentResult = await processPayment({
        amount: parseFloat(totalAmount.toFixed(2)), // Ensure amount is a number with 2 decimal places
        paymentDetails: {
          cardNumber: paymentDetails.cardNumber.replace(/\s/g, ''),
          expiry: paymentDetails.expiryDate,
          cvv: paymentDetails.cvv,
          name: paymentDetails.cardName,
          currency: 'USD',
          description: `Movie Ticket(s) for ${show?.title}`
        }
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment processing failed');
      }

      // Create booking data in the format expected by the backend
      const bookingData = {
        showId: show._id,
        theaterId: selectedTheater._id,
        showtimeId: selectedShowtime._id,
        seats: selectedSeats, // Array of seat numbers
        showTime: selectedShowtime.showTime,
        paymentDetails: {
          transactionId: paymentResult.transactionId,
          method: 'card',
          status: 'completed',
          amount: parseFloat(totalAmount.toFixed(2))
        },
        // The backend will get the user ID from the auth token
      };

      console.log('Creating booking with data:', bookingData);
      
      try {
        // Save booking to database
        const response = await createBooking(bookingData);
        
        console.log('Booking response in component:', response);
        
        if (!response || !response.data || !response.data.length) {
          throw new Error('No booking data returned from server');
        }

        const bookingDataFromServer = response.data[0];
        
        // Clear selected seats after successful booking
        setSelectedSeats([]);
        // Refetch booked seats to ensure UI is up to date
        if (selectedShowtime) {
          refetchBookedSeats();
        }

        // Prepare navigation state with all necessary booking details
        const navigationState = {
          booking: {
            _id: bookingDataFromServer._id,
            bookingReference: bookingDataFromServer.bookingReference,
            status: bookingDataFromServer.status || 'confirmed',
            show: {
              _id: show._id,
              title: show.title,
              image: show.image,
              duration: show.duration,
              description: show.description
            },
            theater: selectedTheater,
            showtime: selectedShowtime,
            showTime: selectedShowtime.showTime,
            // Pass seats as an array of strings for display
            seats: selectedSeats,
            // Also include the detailed seat information
            seatDetails: selectedSeats.map(seat => ({
              seatNumber: seat,
              price: selectedShowtime.price?.base || show.price
            })),
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            payment: {
              transactionId: paymentResult.transactionId,
              amount: parseFloat(totalAmount.toFixed(2)),
              status: 'completed',
              method: 'card',
              date: new Date().toISOString()
            },
            createdAt: new Date().toISOString(),
            user: {
              name: user?.name || user?.username || 'Guest',
              email: user?.email
            }
          }
        };

        console.log('Navigating to booking confirmation with state:', navigationState);
        
        // Navigate to booking confirmation with the booking ID in the URL
        // and the full booking data in the location state
        navigate(`/booking-confirmation/${bookingDataFromServer._id}`, {
          state: navigationState,
          replace: true
        });
      } catch (error) {
        console.error('Error creating booking:', error);
        throw error; // Re-throw to be caught by the outer catch
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Payment failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsProcessing(false);
      setIsPaymentOpen(false);
    }
  };
  
  const handleClosePayment = () => {
    setIsPaymentOpen(false);
    setPaymentDetails({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const generateSeatLayout = () => {
    try {
      if (!show) return [];
      
      const totalSeats = 30; // 6 seats per row, 5 rows
      const seatsPerRow = 6;
      const totalRows = 5;
      const seats = [];
      
      // Ensure bookedSeats is an array of strings
      const bookedSeatsArray = Array.isArray(bookedSeats) 
        ? bookedSeats.map(seat => String(seat))
        : [];
        
      // Ensure selectedSeats is an array of strings
      const selectedSeatsArray = Array.isArray(selectedSeats)
        ? selectedSeats.map(seat => String(seat))
        : [];
      
      for (let row = 1; row <= totalRows; row++) {
        const rowSeats = [];
        
        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
          const seatId = String((row - 1) * seatsPerRow + seatNum); // Creates seat numbers 1-30
          const isBooked = bookedSeatsArray.includes(seatId);
          const isSelected = selectedSeatsArray.includes(seatId);
          
          rowSeats.push(
            <Box
              key={`seat-${seatId}`}
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
                transition: 'all 0.2s ease',
              }}
            >
              <EventSeat />
              <Typography variant="caption" sx={{ 
                fontSize: '0.6rem', 
                mt: 0.5,
                userSelect: 'none'
              }}>
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
    } catch (error) {
      console.error('Error generating seat layout:', error);
      return (
        <Box textAlign="center" py={4}>
          <Typography color="error">
            Error loading seat layout. Please try refreshing the page.
          </Typography>
        </Box>
      );
    }
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
          mb: 4,
          borderRadius: 2
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.paper',
                height: '100%',
                minHeight: '450px',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box
                component="img"
                src={show?.image || show?.posterUrl}
                alt={show?.title || 'Movie Poster'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster+Available';
                }}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              />
              {!show?.image && !show?.posterUrl && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    color: 'text.secondary',
                    p: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body1">
                    {show?.title || 'Movie'} poster not available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {show?.title}
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                <Chip 
                  icon={<AccessTime />} 
                  label={`${Math.floor(show?.duration / 60) || 0}h ${show?.duration % 60 || 0}m`} 
                  size="small" 
                />
                <Chip 
                  icon={<Star color="warning" />} 
                  label={`${show?.rating || 'N/A'}/10`} 
                  size="small" 
                />
                <Chip label={show?.genre || 'N/A'} size="small" variant="outlined" />
                <Chip label={show?.language || 'N/A'} size="small" variant="outlined" />
                <Chip 
                  icon={<AttachMoney />} 
                  label={`$${show?.price || '9.99'}`}
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
                About the Movie
              </Typography>
              <Typography paragraph sx={{ mb: 3 }}>
                {show?.description || 'No description available.'}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Select Showtime
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                {/* Theater Selection */}
                {isLoadingTheaters ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : theaters && theaters.length > 0 ? (
                  <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                    <TheaterSelection
                      theaters={theaters}
                      selectedTheater={selectedTheater}
                      onTheaterSelect={handleTheaterSelect}
                      selectedShowtime={selectedShowtime}
                      onShowtimeSelect={handleShowtimeSelect}
                    />
                  </Paper>
                ) : (
                  <Alert severity="info" sx={{ mb: 4 }}>
                    No theaters found for this movie. Please check back later.
                  </Alert>
                )}

                {show?.showTimes?.length > 0 ? (
                  show.showTimes.map((time, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        // Create a mock showtime object for legacy support
                        const mockShowtime = {
                          _id: `${show._id}-${time}`,
                          showTime: time,
                          show: show._id,
                          availableSeats: show.availableSeats || 100,
                          price: { base: show.price || 10 }
                        };
                        setSelectedShowtime(mockShowtime);
                      }}
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
                        ...(selectedShowtime?.showTime === time && {
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
                  ))
                ) : (
                  <Typography color="textSecondary">No showtimes available</Typography>
                )}
              </Box>

              {selectedShowTime && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Select Seats
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ 
                      backgroundColor: 'background.paper', 
                      p: 3, 
                      borderRadius: 2,
                      boxShadow: 1
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        mb: 3
                      }}>
                        <Box sx={{ 
                          width: '60%', 
                          height: '20px', 
                          backgroundColor: 'primary.main',
                          borderRadius: '4px 4px 0 0',
                          mb: 1
                        }} />
                        <Typography variant="caption" color="textSecondary">
                          Screen
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 4 }}>
                        {generateSeatLayout()}
                      </Box>
                      
                      <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
                        <Box display="flex" alignItems="center">
                          <Box sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                            mr: 1
                          }} />
                          <Typography variant="caption">Available</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Box sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'primary.main',
                            borderRadius: 1,
                            mr: 1
                          }} />
                          <Typography variant="caption">Selected</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Box sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'error.light',
                            borderRadius: 1,
                            mr: 1,
                            opacity: 0.7
                          }} />
                          <Typography variant="caption">Booked</Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                      <Typography variant="h6">
                        Total: ${total} <Typography component="span" color="textSecondary">({selectedSeats.length} seats)</Typography>
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleBookNow}
                        disabled={selectedSeats.length === 0}
                        sx={{ mt: 2, minWidth: 200 }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Payment Dialog */}
      <Dialog 
        open={isPaymentOpen} 
        onClose={handleClosePayment}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Complete Your Booking</Typography>
            <IconButton onClick={handleClosePayment} size="small">
              <Close />
            </IconButton>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {show?.title} - {selectedShowtime?.showTime}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedTheater?.name}
          </Typography>
          <Typography variant="subtitle2">
            Seats: {selectedSeats.join(', ')}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
            Total: ₹{total}
          </Typography>
        </DialogTitle>
        
        <form onSubmit={handlePaymentSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Card Number"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Cardholder Name"
                  name="cardName"
                  value={paymentDetails.cardName}
                  onChange={handlePaymentChange}
                  placeholder="John Doe"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Expiry Date"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handlePaymentChange}
                  placeholder="MM/YY"
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentChange}
                  placeholder="123"
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={handleClosePayment} 
              color="inherit"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isProcessing || !paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiryDate || !paymentDetails.cvv}
              startIcon={isProcessing ? <CircularProgress size={20} /> : null}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
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
