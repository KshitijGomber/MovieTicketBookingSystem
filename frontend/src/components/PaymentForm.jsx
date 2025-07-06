import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { processPayment, createBooking } from '../api/bookings';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ showId, showTime, seats, amount, onBack, onSuccess }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : '';
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Process payment
      const paymentResult = await processPayment({
        amount: amount * 100, // Convert to cents
        paymentDetails: {
          ...paymentDetails,
          method: 'card',
        },
      });

      if (!paymentResult.success) {
        throw new Error('Payment processing failed');
      }

      // Create booking
      const booking = await createBooking({
        showId,
        seats,
        showTime,
        paymentDetails: {
          transactionId: paymentResult.transactionId,
          method: 'card',
        },
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(booking);
      } else {
        // Default success behavior
        navigate(`/booking-confirmation/${booking._id}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={formatCardNumber(paymentDetails.cardNumber)}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setPaymentDetails(prev => ({
                      ...prev,
                      cardNumber: formatted
                    }));
                  }}
                  placeholder="1234 5678 9012 3456"
                  inputProps={{
                    maxLength: 19,
                    inputMode: 'numeric',
                    pattern: '[0-9\s]{13,19}'
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Name on Card"
                  name="name"
                  value={paymentDetails.name}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  label="Expiry (MM/YY)"
                  name="expiry"
                  value={paymentDetails.expiry}
                  onChange={(e) => {
                    const formatted = formatExpiry(e.target.value);
                    setPaymentDetails(prev => ({
                      ...prev,
                      expiry: formatted
                    }));
                  }}
                  placeholder="MM/YY"
                  inputProps={{
                    maxLength: 5,
                    inputMode: 'numeric',
                    pattern: '([0-9]{2}/[0-9]{2})?'
                  }}
                />
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={paymentDetails.cvv}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 4,
                    inputMode: 'numeric',
                    pattern: '\d{3,4}'
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={onBack}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !paymentDetails.cardNumber || !paymentDetails.name || !paymentDetails.expiry || !paymentDetails.cvv}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Processing...' : `Pay $${amount}`}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Movie
                </Typography>
                <Typography>{showId}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Showtime
                </Typography>
                <Typography>{new Date(showTime).toLocaleString()}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Seats
                </Typography>
                <Typography>{seats.join(', ')}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${amount}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Taxes & Fees</Typography>
                <Typography>$0.00</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography>Total</Typography>
                <Typography>${amount}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentForm;
