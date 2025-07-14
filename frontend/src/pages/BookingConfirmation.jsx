import React from 'react';
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
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  LocalMovies as MovieIcon, 
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  EventSeat as SeatIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon
} from '@mui/icons-material';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  
  // Get all data from navigation state
  const { booking, movie, theater, showtime, seats, pricing } = location.state || {};

  // Format date and time
  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not specified';
    try {
      const date = new Date(dateTime);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTime;
    }
  };

  // If no data available, redirect to home
  if (!booking && !movie) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          No booking information found. Please check your bookings or make a new booking.
        </Alert>
        <Box textAlign="center" mt={2}>
          <Button variant="contained" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white'
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Booking Confirmed!
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Your tickets have been successfully booked
        </Typography>
        {booking?._id && (
          <Chip 
            label={`Booking ID: ${booking._id}`} 
            sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        )}
      </Paper>

      <Grid container spacing={4}>
        {/* Movie & Theater Details */}
        <Grid item xs={12} lg={8}>
          {/* Movie Information */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MovieIcon color="primary" /> Movie Details
              </Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <img 
                    src={movie?.image} 
                    alt={movie?.title}
                    style={{ 
                      width: '100%', 
                      maxWidth: '200px',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    {movie?.title}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                    <Chip label={movie?.genre} variant="outlined" />
                    <Chip label={`${movie?.duration} min`} variant="outlined" />
                    <Chip label={movie?.language} variant="outlined" />
                    <Chip label={movie?.rating} color="primary" />
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {movie?.description}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Theater & Showtime Information */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="primary" /> Theater & Show Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box mb={2}>
                    <Typography variant="h6" gutterBottom>{theater?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {theater?.location?.address}<br />
                      {theater?.location?.city}, {theater?.location?.state} {theater?.location?.zipCode}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">Screen</Typography>
                    <Typography variant="body1">{showtime?.screen || 'Screen 1'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">Show Date & Time</Typography>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimeIcon /> {formatDateTime(showtime?.showTime)}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">Selected Seats</Typography>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SeatIcon /> {seats?.join(', ') || booking?.seats?.join(', ')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Amenities */}
          {theater?.amenities && theater.amenities.length > 0 && (
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Theater Amenities</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {theater.amenities.map((amenity, index) => (
                    <Chip key={index} label={amenity} variant="outlined" size="small" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Booking Summary & Receipt */}
        <Grid item xs={12} lg={4}>
          <Card elevation={2} sx={{ position: 'sticky', top: 100 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon color="primary" /> Booking Summary
              </Typography>

              {/* Booking Status */}
              <Box mb={3}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={booking?.status || 'Confirmed'} 
                  color="success" 
                  icon={<CheckCircleIcon />} 
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Pricing Breakdown */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Price Breakdown</Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {pricing?.seatCount || seats?.length || 1} seat(s) × ${pricing?.pricePerSeat || showtime?.price?.base || 10}
                  </Typography>
                  <Typography variant="body2">${pricing?.subtotal || '0.00'}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Convenience Fee</Typography>
                  <Typography variant="body2">$2.00</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Tax (10%)</Typography>
                  <Typography variant="body2">${pricing?.tax || '0.00'}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">Total Paid</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ${pricing?.total || booking?.totalAmount?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </Box>

              {/* Payment Method */}
              <Box mb={3}>
                <Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>
                <Typography variant="body1">
                  Credit Card (**** **** **** 1234)
                </Typography>
                <Chip label="Payment Successful" color="success" size="small" sx={{ mt: 1 }} />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Contact Information */}
              <Box mb={3}>
                <Typography variant="subtitle2" color="text.secondary">Theater Contact</Typography>
                <Typography variant="body2">{theater?.contact?.phone}</Typography>
                <Typography variant="body2">{theater?.contact?.email}</Typography>
              </Box>

              {/* Action Buttons */}
              <Stack spacing={2}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate('/my-bookings')}
                  size="large"
                >
                  View My Bookings
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/')}
                  startIcon={<HomeIcon />}
                >
                  Back to Home
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
