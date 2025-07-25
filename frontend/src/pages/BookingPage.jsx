import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchShow } from '../api/shows';
import { getBookedSeats, createBooking } from '../api/bookings';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  CircularProgress, 
  Alert,
  Paper,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { ArrowBack, EventSeat, AccessTime, LocationOn } from '@mui/icons-material';
import SeatSelection from '../components/SeatSelection';
import { useAuth } from '../context/AuthContext';
import { SeatSelectionSkeleton } from '../components/LoadingSkeleton';
import PaymentModal from '../components/PaymentModal';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Get data from navigation state (passed from MovieDetailsPage)
  const { movie, theater, showtime } = location.state || {};
  
  // Debug logging (moved after destructuring to avoid hoisting issues)
  React.useEffect(() => {
    console.log('BookingPage - showId from URL:', showId);
    console.log('BookingPage - Auth state:', { user: !!user, token: !!token });
    console.log('BookingPage - Location state:', { movie: !!movie, theater: !!theater, showtime: !!showtime });
  }, [showId, user, token, movie, theater, showtime]);

  // Redirect if missing required data
  useEffect(() => {
    if (!movie || !theater || !showtime) {
      navigate(`/movies/${showId}`, { 
        replace: true,
        state: { error: 'Please select a theater and showtime first' }
      });
    }
  }, [movie, theater, showtime, showId, navigate]);

  // Check authentication
  useEffect(() => {
    if (!token || !user) {
      alert('Please sign in to book tickets.');
      navigate('/signin', { 
        state: { from: location.pathname, returnData: location.state }
      });
    }
  }, [token, user, navigate, location]);

  // Fetch booked seats for this specific showtime and theater
  const { data: bookedSeats = [], isLoading: isLoadingSeats } = useQuery({
    queryKey: ['bookedSeats', showtime?._id, theater?._id],
    queryFn: () => getBookedSeats(showId, showtime?.showTime, theater?._id),
    enabled: !!(showtime && theater && showId),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  const calculateTotal = () => {
    const seatPrice = showtime?.price?.base || movie?.price || 10;
    const subtotal = selectedSeats.length * seatPrice;
    const tax = subtotal * 0.1; // 10% tax
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2),
      seatCount: selectedSeats.length,
      pricePerSeat: seatPrice
    };
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setShowPaymentModal(false);
    setIsProcessing(true);
    
    try {
      const pricing = calculateTotal();
      
      const bookingData = {
        showId: movie._id,
        theaterId: theater._id,
        seats: selectedSeats,
        showTime: showtime.showTime,
        totalAmount: parseFloat(pricing.total),
        paymentDetails: {
          method: 'card', // Mock payment
          status: 'completed',
          transactionId: paymentResult.transactionId
        }
      };

      const booking = await createBooking(bookingData);
      
      // Navigate to confirmation page
      navigate(`/booking-confirmation/${booking._id}`, {
        state: {
          booking,
          movie,
          theater,
          showtime,
          seats: selectedSeats,
          pricing
        }
      });
    } catch (error) {
      console.error('Booking failed:', error);
      
      // More specific error messages
      if (error.message.includes('Invalid token') || error.message.includes('401')) {
        alert('Please sign in to book tickets.');
        navigate('/signin');
      } else if (error.message.includes('Theater ID is required')) {
        alert('Please select a theater and showtime first.');
        navigate(`/movies/${showId}`);
      } else {
        alert(`Booking failed: ${error.message}. Please try again.`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!movie || !theater || !showtime) {
    return null; // Will redirect in useEffect
  }

  const pricing = calculateTotal();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(`/movies/${showId}`)}
          sx={{ mb: 2 }}
        >
          Back to Movie Details
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Book Your Seats
        </Typography>
        
        {/* Movie & Theater Info */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <img 
                src={movie.image} 
                alt={movie.title}
                style={{ 
                  width: '100%', 
                  maxWidth: '150px',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography variant="h5" gutterBottom>{movie.title}</Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                <Chip icon={<LocationOn />} label={theater.name} />
                <Chip icon={<AccessTime />} label={showtime.showTime} />
                <Chip 
                  label={`${movie.duration} min`} 
                  variant="outlined" 
                />
                <Chip 
                  label={movie.language} 
                  variant="outlined" 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {theater.location?.address}, {theater.location?.city}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Grid container spacing={4}>
        {/* Seat Selection */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventSeat /> Select Your Seats
            </Typography>
            
            {isLoadingSeats ? (
              <SeatSelectionSkeleton />
            ) : (
              <SeatSelection
                totalSeats={30} // Fixed 30 seats per showtime
                bookedSeats={bookedSeats}
                onSeatSelection={handleSeatSelection}
                selectedSeats={selectedSeats}
              />
            )}
          </Paper>
        </Grid>

        {/* Booking Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">Selected Seats:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  {pricing.seatCount} seat(s) × ${pricing.pricePerSeat}
                </Typography>
                <Typography variant="body2">${pricing.subtotal}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Tax (10%)</Typography>
                <Typography variant="body2">${pricing.tax}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight="bold">Total</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${pricing.total}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || isProcessing}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                }
              }}
            >
              {isProcessing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`
              )}
            </Button>

            {selectedSeats.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Please select at least one seat to continue.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        bookingDetails={{
          movieTitle: movie?.title,
          seats: selectedSeats,
          totalAmount: parseFloat(pricing.total)
        }}
        isProcessing={isProcessing}
      />
    </Container>
  );
};

export default BookingPage;
