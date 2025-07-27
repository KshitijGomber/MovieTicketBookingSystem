import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchShow } from '../api/shows';
import { 
  Typography, 
  Paper, 
  Button, 
  Box, 
  Alert, 
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const BookingForm = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [cvv, setCvv] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [expiry, setExpiry] = useState('');
  const [expiryError, setExpiryError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    }
  }, [token, navigate]);

  const { data: show, isLoading, isError } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => fetchShow(showId),
  });

  useEffect(() => {
    // Get booking details from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    const seats = params.get('seats');
    const showTime = params.get('showTime');
    
    if (seats && showTime) {
      setBookingDetails({
        seats: seats.split(',').map(s => parseInt(s)),
        showTime: showTime,
        totalPrice: seats.split(',').length * 10
      });
    }
  }, []);

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    setCvv(value);
    
    // Clear error when input is empty
    if (!value) {
      setCvvError('');
      return;
    }
    
    // Validate CVV
    const isValid = validateCVV(value);
    setCvvError(isValid ? '' : 'Please enter a valid CVV (3-4 digits)');
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value;
    
    // Allow only digits and slash
    value = value.replace(/[^\d/]/g, '');
    
    // Auto-insert slash after MM
    if (value.length === 2 && !value.includes('/')) {
      value = value + '/';
    }
    
    // Limit to MM/YY format
    if (value.length > 5) return;
    
    setExpiry(value);
    
    // Clear error when input is empty
    if (!value.trim()) {
      setExpiryError('');
      return;
    }
    
    // Validate format and date
    const isValid = validateExpiry(value);
    setExpiryError(isValid ? '' : 'Please enter a valid expiry date (MM/YY)');
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value;
    
    // Allow only digits and spaces
    value = value.replace(/[^\d\s]/g, '');
    
    // Limit to 16 digits with optional spaces
    if (value.length > 19) return;
    
    setCardNumber(value);
    
    // Clear error when input is empty
    if (!value.trim()) {
      setCardNumberError('');
      return;
    }
    
    // Validate card number
    const isValid = validateCardNumber(value);
    setCardNumberError(isValid ? '' : 'Please enter a valid card number');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      // Prepare booking data
      const bookingData = {
        showId: show._id,
        movieId: show.movie._id,
        theaterId: show.theater._id,
        showTime: bookingDetails.showTime,
        seats: bookingDetails.seats,
        totalAmount: bookingDetails.totalPrice,
        paymentMethod: 'card',
        cardLast4: cardNumber.slice(-4).replace(/\s/g, '')
      };
      
      // Make API call to create booking
      const response = await fetch('https://movieticketbookingsystem-7suc.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process booking');
      }
      
      // Handle successful payment
      const result = await response.json();
      setPaymentStatus('succeeded');
      onPaymentSuccess(result);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('failed');
      setError(error.message || 'Payment failed. Please try again.');
      
      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.getElementById('payment-error');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
    } finally {
      setIsProcessing(false);
    }
  };

  const validateCVV = (value) => {
    return value.length >= 3 && value.length <= 4;
  };

  const validateExpiry = (value) => {
    const parts = value.split('/');
    if (parts.length !== 2) return false;
    const month = parseInt(parts[0]);
    const year = parseInt(parts[1]);
    return month >= 1 && month <= 12 && year >= 22;
  };

  const validateCardNumber = (value) => {
    // Accepts 16 digits with optional spaces or hyphens after every 4 digits
    const regex = /^(\d{4}[\s-]?){3}\d{4}$/;
    return regex.test(value);
  };

  if (isLoading) return <CircularProgress />;
  if (isError || !show) return <Alert severity="error">Show not found.</Alert>;

  if (!bookingDetails) {
    return (
      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Booking Details
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          No booking details found. Please go back and select seats.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/show/${showId}`)}
          sx={{ mt: 2 }}
        >
          Back to Show Details
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Booking Confirmation
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {show.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {show.description}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItem>
          <ListItemText 
            primary="Show Time" 
            secondary={bookingDetails.showTime}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Selected Seats" 
            secondary={bookingDetails.seats.join(', ')}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Number of Seats" 
            secondary={bookingDetails.seats.length}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Price per Seat" 
            secondary="$10"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Total Amount" 
            secondary={`$${bookingDetails.totalPrice}`}
            sx={{ 
              '& .MuiListItemText-primary': { 
                fontWeight: 'bold',
                fontSize: '1.1rem'
              },
              '& .MuiListItemText-secondary': { 
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: 'primary.main'
              }
            }}
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <Alert severity="success" sx={{ mb: 3 }}>
        Your booking has been confirmed! You will receive a confirmation email shortly.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/my-bookings')}
          sx={{ minWidth: 120 }}
        >
          View My Bookings
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ minWidth: 120 }}
        >
          Back to Shows
        </Button>
      </Box>
    </Paper>
  );
};

export default BookingForm; 