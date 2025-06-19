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

const BookingForm = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

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