import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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
  Divider,
  useTheme,
  alpha
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
  const theme = useTheme();
  
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
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        pt: 12
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6 }}>
            <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
              <Button 
                startIcon={<ArrowBack />} 
                onClick={() => navigate(`/movies/${showId}`)}
                sx={{ 
                  mb: 3,
                  color: theme.palette.primary.main,
                  fontWeight: 'medium',
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                Back to Movie Details
              </Button>
            </motion.div>
            
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)'
                  : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Book Your Seats
            </Typography>
            
            {/* Movie & Theater Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  mb: 4,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          borderRadius: 3,
                          overflow: 'hidden',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                          maxWidth: 200,
                          mx: { xs: 'auto', md: 0 }
                        }}
                      >
                        <img 
                          src={movie.image} 
                          alt={movie.title}
                          style={{ 
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, transparent 30%, rgba(102, 126, 234, 0.1) 100%)'
                          }}
                        />
                      </Box>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 3,
                        color: theme.palette.text.primary
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Chip 
                          icon={<LocationOn />} 
                          label={theater.name}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 'medium',
                            '& .MuiChip-icon': { color: 'white' }
                          }}
                        />
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Chip 
                          icon={<AccessTime />} 
                          label={showtime.showTime}
                          sx={{
                            background: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                            fontWeight: 'medium'
                          }}
                        />
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Chip 
                          label={`${movie.duration} min`}
                          sx={{
                            background: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                            border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                            fontWeight: 'medium'
                          }}
                        />
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Chip 
                          label={movie.language}
                          sx={{
                            background: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.main,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                            fontWeight: 'medium'
                          }}
                        />
                      </motion.div>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {theater.location?.address}, {theater.location?.city}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>

        {/* Seat Selection and Booking Summary */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Grid container spacing={4}>
            {/* Seat Selection */}
            <Grid item xs={12} lg={8}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 3,
                    fontWeight: 'bold',
                    color: theme.palette.text.primary
                  }}
                >
                  <EventSeat sx={{ color: theme.palette.primary.main }} />
                  Select Your Seats
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
            <Grid item xs={12} lg={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  position: 'sticky', 
                  top: 120,
                  background: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3,
                    fontWeight: 'bold',
                    color: theme.palette.text.primary
                  }}
                >
                  Booking Summary
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Selected Seats:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color={theme.palette.primary.main}>
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body1">
                      {pricing.seatCount} seat(s) × ${pricing.pricePerSeat}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${pricing.subtotal}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body1">Tax (10%)</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${pricing.tax}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" justifyContent="space-between" mb={4}>
                  <Typography variant="h5" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    ${pricing.total}
                  </Typography>
                </Box>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0 || isProcessing}
                    sx={{
                      py: 2.5,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        background: alpha(theme.palette.action.disabled, 0.12),
                        color: theme.palette.action.disabled
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isProcessing ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`
                    )}
                  </Button>
                </motion.div>

                {selectedSeats.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mt: 3,
                        borderRadius: 2,
                        background: alpha(theme.palette.info.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                      }}
                    >
                      Please select at least one seat to continue.
                    </Alert>
                  </motion.div>
                )}
              </Paper>
            </Grid>
          </Grid>
        </motion.div>

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
    </Box>
  );
};

export default BookingPage;
