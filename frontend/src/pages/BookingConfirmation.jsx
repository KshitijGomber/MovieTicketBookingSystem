import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  Container,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  LocalMovies as MovieIcon, 
  Event as EventIcon, 
  ConfirmationNumber as TicketIcon, 
  AccessTime as TimeIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getBooking } from '../api/bookings';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const processBooking = async () => {
      try {
        let bookingData;
        
        // If we have booking data in location state, use it
        if (location.state?.booking) {
          bookingData = location.state.booking;
        } 
        // Otherwise, fetch it using the bookingId from the URL
        else if (bookingId) {
          bookingData = await getBooking(bookingId, token);
        } 
        // If we have neither, show an error
        else {
          throw new Error('No booking information found');
        }
        
        // Set booking details from the booking object
        setBookingDetails({
          show: bookingData.show,
          showTime: bookingData.showTime,
          seats: bookingData.seats,
          total: bookingData.totalAmount || 0,
          bookingId: bookingData.bookingReference || bookingId,
          bookingDate: bookingData.createdAt || new Date().toISOString(),
          payment: bookingData.payment || {}
        });
        
        setLoading(false);

      } catch (err) {
        console.error('Booking confirmation error:', err);
        setError(err.message || 'Failed to load booking details. Please try again.');
        setLoading(false);
      }
    };

    processBooking();
  }, [location.state]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Processing your booking...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
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
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">No booking details available.</Alert>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Box textAlign="center" mb={4}>
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Your booking reference: {bookingDetails.bookingId}
          </Typography>
          <Typography color="text.secondary" paragraph>
            A confirmation has been sent to your email.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <MovieIcon sx={{ mr: 1 }} /> Movie Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', mb: 3 }}>
                <img 
                  src={bookingDetails.show?.image} 
                  alt={bookingDetails.show?.title} 
                  style={{ 
                    width: '120px',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginRight: '16px'
                  }} 
                />
                <Box>
                  <Typography variant="h6" gutterBottom>{bookingDetails.show?.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {bookingDetails.show?.description || 'No description available.'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {bookingDetails.show?.duration || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 1 }} /> Booking Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon><TimeIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Show Time" 
                    secondary={formatDate(bookingDetails.showTime)} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TicketIcon /></ListItemIcon>
                  <ListItemText 
                    primary="Seats" 
                    secondary={bookingDetails.seats?.join(', ') || 'No seats selected'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Total Amount" 
                    secondary={`$${bookingDetails.total?.toFixed(2) || '0.00'}`} 
                    sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold' } }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.print()}
          >
            Print Ticket
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
