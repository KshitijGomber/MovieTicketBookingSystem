import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  CheckCircle as CheckCircleIcon,
  Movie as MovieIcon,
  EventSeat as EventSeatIcon,
  AccessTime as AccessTimeIcon,
  LocalAtm as LocalAtmIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { fetchShow } from '../api/shows';
import { getBookingByPaymentId } from '../api/bookings';

const BookingConfirmation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { showId } = useParams();
  
  // Get booking details from URL params
  const searchParams = new URLSearchParams(location.search);
  const seats = searchParams.get('seats')?.split(',').map(Number) || [];
  const showTime = searchParams.get('showTime');
  const paymentId = searchParams.get('paymentId');
  
  // Fetch show details
  const { data: show, isLoading: isShowLoading, isError: isShowError } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => fetchShow(showId),
  });

  // Fetch booking details if payment ID is available
  const { data: booking, isLoading: isBookingLoading } = useQuery({
    queryKey: ['booking', paymentId],
    queryFn: () => getBookingByPaymentId(paymentId),
    enabled: !!paymentId,
  });

  const isLoading = isShowLoading || isBookingLoading;
  const isError = isShowError;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !show) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading booking details. Please try again.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Box>
    );
  }

  if (!seats.length || !showTime) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Invalid booking details. Please try again.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Box>
    );
  }

  // Calculate amounts
  const seatPrice = 10; // $10 per seat
  const totalAmount = seats.length * seatPrice;
  const gst = totalAmount * 0.18; // 18% GST
  const totalWithGst = totalAmount + gst;
  
  // Use actual booking reference from the booking data or generate a temporary one
  const bookingReference = booking?.bookingReference || `BK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  
  // Use actual payment ID from URL or booking data
  const displayPaymentId = paymentId || booking?.payment?.id || `PAY-${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
  
  // Format the show time
  const formattedShowTime = showTime ? new Date(showTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'N/A';

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon 
          sx={{ 
            fontSize: 80, 
            color: 'success.main',
            mb: 2
          }} 
        />
        <Typography variant="h4" gutterBottom>
          Booking Confirmed!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your tickets have been booked successfully
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Booking Reference: <strong>{bookingReference}</strong>
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Booking Details</Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <MovieIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Movie" 
                  secondary={show.title} 
                  secondaryTypographyProps={{ color: 'text.primary' }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <EventSeatIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Seats" 
                  secondary={seats.join(', ')}
                  secondaryTypographyProps={{ color: 'text.primary' }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Show Time" 
                  secondary={formattedShowTime}
                  secondaryTypographyProps={{ color: 'text.primary' }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LocalAtmIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Total Amount" 
                  secondary={`$${totalWithGst.toFixed(2)}`}
                  secondaryTypographyProps={{ 
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <ReceiptIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Payment ID" 
                  secondary={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace' }}>{displayPaymentId}</span>
                      {booking?.payment?.status === 'succeeded' && (
                        <CheckCircleIcon 
                          color="success" 
                          fontSize="small" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Box>
                  }
                  secondaryTypographyProps={{ 
                    component: 'div',
                    sx: { 
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.9rem' 
                    }
                  }}
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body2" color="success.dark">
                🎉 You've earned {Math.floor(totalWithGst)} loyalty points with this booking!
              </Typography>
            </Box>
          </Paper>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/my-bookings')}
            >
              View My Bookings
            </Button>
            <Button 
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>What's Next?</Typography>
            
            <List dense>
              <ListItem sx={{ alignItems: 'flex-start', px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <Typography color="primary">1</Typography>
                </ListItemIcon>
                <ListItemText 
                  primary="Check your email" 
                  secondary="We've sent your e-tickets to your registered email address."
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              
              <Divider component="li" sx={{ my: 2 }} />
              
              <ListItem sx={{ alignItems: 'flex-start', px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <Typography color="primary">2</Typography>
                </ListItemIcon>
                <ListItemText 
                  primary="Arrive early" 
                  secondary="Please arrive at least 30 minutes before the showtime."
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              
              <Divider component="li" sx={{ my: 2 }} />
              
              <ListItem sx={{ alignItems: 'flex-start', px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <Typography color="primary">3</Typography>
                </ListItemIcon>
                <ListItemText 
                  primary="Enjoy the show!" 
                  secondary="Show your e-ticket at the entrance or use the QR code in your email."
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Need help?</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Contact our support team at support@movietix.com or call +1 (555) 123-4567
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingConfirmation;
