import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { createBooking } from '../api/bookings';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const processBooking = async () => {
      try {
        if (!location.state) {
          throw new Error('No booking information found');
        }

        const { show, showTime, seats, total, bookingId, bookingDate } = location.state;
        
        // Send booking details to backend
        const bookingData = {
          showId: show._id,
          showTitle: show.title,
          showTime,
          seats,
          total,
          bookingId,
          bookingDate: bookingDate || new Date().toISOString(),
        };

        // Save booking to database
        await createBooking(bookingData);
        
        setBookingDetails(bookingData);
        setLoading(false);

        // Send confirmation email (handled by backend)
        // The backend should handle sending the email

      } catch (err) {
        console.error('Booking confirmation error:', err);
        setError(err.message || 'Failed to process booking. Please try again.');
        setLoading(false);
      }
    };

    processBooking();
  }, [location.state]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Processing your booking...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!bookingDetails) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">
          No booking information found. Please try again.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography color="text.secondary" paragraph>
            Thank you for your booking. A confirmation has been sent to your email.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Booking Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary">Booking ID</Typography>
              <Typography variant="body1">{bookingDetails.bookingId}</Typography>
            </Box>
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary">Movie</Typography>
              <Typography variant="body1">{bookingDetails.showTitle}</Typography>
            </Box>
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary">Show Time</Typography>
              <Typography variant="body1">
                {new Date(bookingDetails.showTime).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Seat Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary">Seats</Typography>
              <Typography variant="body1">{bookingDetails.seats.join(', ')}</Typography>
            </Box>
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
              <Typography variant="h6" color="primary">
                ${parseFloat(bookingDetails.total).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} pt={3} borderTop={1} borderColor="divider">
          <Typography variant="body2" color="text.secondary" paragraph>
            A confirmation email has been sent to your registered email address with all the details.
            Please present this booking ID at the theater.
          </Typography>
          
          <Box mt={4} display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.print()}
            >
              Print Ticket
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
