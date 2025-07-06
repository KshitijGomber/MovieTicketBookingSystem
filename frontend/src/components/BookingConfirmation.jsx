import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookings } from '../api/bookings';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookings = await getBookings();
        const foundBooking = bookings.find(b => b._id === bookingId);
        
        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!booking) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        No booking details found.
      </Alert>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" my={4} p={3}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: 'success.light',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h4" color="success.contrastText">
              ✓
            </Typography>
          </Box>
          <Typography variant="h4" gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography color="text.secondary">
            We've sent a confirmation email to your registered email address.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            <List>
              <ListItem disableGutters>
                <ListItemText
                  primary="Booking Reference"
                  secondary={booking._id}
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary="Movie"
                  secondary={booking.show?.title || 'N/A'}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary="Showtime"
                  secondary={new Date(booking.showTime).toLocaleString()}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary="Seats"
                  secondary={Array.isArray(booking.seat) ? booking.seat.join(', ') : booking.seat}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <List>
              <ListItem disableGutters>
                <ListItemText
                  primary="Amount Paid"
                  secondary={`$${booking.payment?.amount || '0.00'}`}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary="Payment Method"
                  secondary={booking.payment?.method || 'Card'}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary="Transaction ID"
                  secondary={booking.payment?.transactionId || 'N/A'}
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText
                  primary="Status"
                  secondary={
                    <Box component="span" sx={{ color: 'success.main' }}>
                      Confirmed
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/my-bookings')}
            sx={{ mr: 2 }}
          >
            View All Bookings
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BookingConfirmation;
