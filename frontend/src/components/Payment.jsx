import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createBooking, processPayment } from '../api/bookings';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  const searchParams = new URLSearchParams(location.search);
  const seats = searchParams.get('seats')?.split(',').map(Number) || [];
  const showTime = searchParams.get('showTime');
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const handleCardNumberChange = (e) => {
    // Allow only digits and spaces, format as XXXX XXXX XXXX XXXX
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    // Format as MM/YY, validate month is 01-12
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    let formatted = value;
    
    if (value.length > 2) {
      formatted = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    // Validate month (01-12)
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2), 10);
      if (month < 1 || month > 12) {
        setError('Please enter a valid month (01-12)');
      } else if (error) {
        setError('');
      }
    }
    
    setExpiry(formatted);
  };

  const handleCvvChange = (e) => {
    // Allow only digits, max 4
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvv(value);
  };
  
  const handleNameOnCardChange = (e) => {
    // Allow only letters, spaces, and hyphens
    const value = e.target.value.replace(/[^a-zA-Z\s-]/g, '');
    setNameOnCard(value);
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    // Clear any previous errors when changing payment method
    if (error) setError('');
  };

  if (!token) {
    navigate('/signin', { state: { from: location } });
    return null;
  }

  if (!seats.length || !showTime) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Invalid booking details. Please select seats and showtime again.
        </Alert>
        <Button variant="contained" onClick={() => navigate(`/show/${showId}`)}>
          Back to Show
        </Button>
      </Box>
    );
  }

  const totalAmount = seats.length * 10; // $10 per seat
  const gst = totalAmount * 0.18; // 18% GST
  const totalWithGst = totalAmount + gst;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiry || !cvv || !nameOnCard) {
        setError('Please fill in all card details');
        return;
      }
      
      // Simple validation for card number (16 digits)
      const cardNumberRegex = /^\d{16}$/;
      if (!cardNumberRegex.test(cardNumber.replace(/\s+/g, ''))) {
        setError('Please enter a valid 16-digit card number');
        return;
      }
      
      // Validate expiry date (MM/YY format)
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(expiry)) {
        setError('Please enter a valid expiry date (MM/YY)');
        return;
      }
      
      // Validate CVV (3 or 4 digits)
      const cvvRegex = /^\d{3,4}$/;
      if (!cvvRegex.test(cvv)) {
        setError('Please enter a valid CVV (3 or 4 digits)');
        return;
      }
    }
    
    setIsProcessing(true);

    try {
      // Process payment first
      const paymentResult = await processPayment({
        amount: Math.round(totalWithGst * 100), // Convert to cents
        currency: 'USD',
        description: `Booking for ${show.title} - ${seats.length} seat(s)`,
        metadata: {
          showId,
          seats: seats.join(','),
          showTime,
        },
        payment_method: paymentMethod,
        payment_details: paymentMethod === 'card' ? {
          card: {
            number: cardNumber.replace(/\s+/g, ''),
            exp_month: expiry.split('/')[0],
            exp_year: `20${expiry.split('/')[1]}`,
            cvc: cvv,
            name: nameOnCard,
          },
        } : {},
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }

      // Create bookings for each seat
      const bookingPromises = seats.map(seat => 
        createBooking({
          showId,
          seat,
          showTime,
          payment: {
            id: paymentResult.paymentId,
            amount: totalWithGst,
            status: paymentResult.status || 'succeeded',
            method: paymentMethod,
          },
        })
      );

      await Promise.all(bookingPromises);
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries(['show', showId]);
      queryClient.invalidateQueries(['bookedSeats', showId, showTime]);
      queryClient.invalidateQueries(['userBookings']);
      
      // Navigate to booking confirmation with payment details
      navigate(`/booking/confirmation?showId=${showId}&seats=${seats.join(',')}&showTime=${encodeURIComponent(showTime)}&paymentId=${paymentResult.paymentId}`);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Payment</Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            
            <Box sx={{ mb: 3 }}>
              <Button
                variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMethod('card')}
                sx={{ mr: 2, mb: 2 }}
              >
                Credit/Debit Card
              </Button>
              <Button
                variant={paymentMethod === 'paypal' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMethod('paypal')}
                disabled
                sx={{ mb: 2 }}
              >
                PayPal (Coming Soon)
              </Button>
            </Box>

            {paymentMethod === 'card' && (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Card Number"
                  fullWidth
                  required
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Name on Card"
                  fullWidth
                  required
                  value={nameOnCard}
                  onChange={handleNameOnCardChange}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Expiry (MM/YY)"
                    fullWidth
                    required
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                  />
                  <TextField
                    label="CVV"
                    fullWidth
                    required
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                  />
                </Box>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isProcessing}
                  sx={{ mt: 2 }}
                >
                  {isProcessing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Pay $${totalWithGst.toFixed(2)}`
                  )}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Seats ({seats.length}):</Typography>
                <Typography>${totalAmount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>GST (18%):</Typography>
                <Typography>${gst.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontWeight: 'bold' }}>
                <Typography>Total:</Typography>
                <Typography>${totalWithGst.toFixed(2)}</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Your tickets will be emailed to you and available in your account.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All sales are final. No refunds or exchanges.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Payment;
