import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  LocalMovies as MovieIcon, 
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  EventSeat as SeatIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const theme = useTheme();
  
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
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          pt: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 4,
                borderRadius: 3,
                background: alpha(theme.palette.warning.main, 0.1),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
              }}
            >
              No booking information found. Please check your bookings or make a new booking.
            </Alert>
            <Box textAlign="center" mt={4}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/')}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                    }
                  }}
                >
                  Return to Home
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
    );
  }

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
          top: '20%',
          right: '10%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '30%',
          left: '5%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              mb: 6, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 20px 50px rgba(76, 175, 80, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative background elements */}
            <Box
              sx={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '-30%',
                left: '-10%',
                width: 150,
                height: 150,
                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
              }}
            />

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CheckCircleIcon sx={{ fontSize: 100, mb: 3, position: 'relative', zIndex: 1 }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography 
                variant="h2" 
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Booking Confirmed!
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  opacity: 0.9,
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Your tickets have been successfully booked
              </Typography>
            </motion.div>

            {booking?._id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Chip 
                  label={`Booking ID: ${booking._id}`} 
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontSize: '1rem',
                    py: 1,
                    px: 2,
                    borderRadius: 3,
                    position: 'relative',
                    zIndex: 1
                  }}
                />
              </motion.div>
            )}
          </Paper>
        </motion.div>

        <Grid container spacing={4}>
          {/* Movie & Theater Details */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              {/* Movie Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card 
                  elevation={0}
                  sx={{ 
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
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
                      <MovieIcon sx={{ color: theme.palette.primary.main }} />
                      Movie Details
                    </Typography>
                    <Grid container spacing={4} alignItems="center">
                      <Grid item xs={12} md={4}>
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
                              maxWidth: 250,
                              mx: { xs: 'auto', md: 0 }
                            }}
                          >
                            <img 
                              src={movie?.image} 
                              alt={movie?.title}
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
                      <Grid item xs={12} md={8}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 'bold',
                            mb: 3,
                            color: theme.palette.text.primary
                          }}
                        >
                          {movie?.title}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Chip 
                              label={movie?.genre} 
                              sx={{
                                background: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                fontWeight: 'medium'
                              }}
                            />
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Chip 
                              label={`${movie?.duration} min`}
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
                              label={movie?.language}
                              sx={{
                                background: alpha(theme.palette.warning.main, 0.1),
                                color: theme.palette.warning.main,
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                                fontWeight: 'medium'
                              }}
                            />
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Chip 
                              label={movie?.rating} 
                              sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 'medium'
                              }}
                            />
                          </motion.div>
                        </Stack>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {movie?.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Theater & Showtime Information */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card 
                  elevation={0}
                  sx={{ 
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
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
                      <LocationIcon sx={{ color: theme.palette.primary.main }} />
                      Theater & Show Details
                    </Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Box mb={3}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {theater?.name}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {theater?.location?.address}<br />
                            {theater?.location?.city}, {theater?.location?.state} {theater?.location?.zipCode}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                            Screen
                          </Typography>
                          <Typography variant="h6" fontWeight="medium">
                            {showtime?.screen || 'Screen 1'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box mb={3}>
                          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                            Show Date & Time
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimeIcon sx={{ color: theme.palette.success.main }} />
                            <Typography variant="h6" fontWeight="medium">
                              {formatDateTime(showtime?.showTime)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                            Selected Seats
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SeatIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="h6" fontWeight="medium">
                              {seats?.join(', ') || booking?.seats?.join(', ')}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Amenities */}
              {theater?.amenities && theater.amenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card 
                    elevation={0}
                    sx={{ 
                      background: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: 3,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Theater Amenities
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {theater.amenities.map((amenity, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Chip 
                              label={amenity} 
                              size="medium"
                              sx={{
                                background: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main,
                                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                fontWeight: 'medium'
                              }}
                            />
                          </motion.div>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </Stack>
          </Grid>

          {/* Booking Summary & Receipt */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  position: 'sticky', 
                  top: 120,
                  background: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      mb: 4,
                      fontWeight: 'bold',
                      color: theme.palette.text.primary
                    }}
                  >
                    <ReceiptIcon sx={{ color: theme.palette.primary.main }} />
                    Booking Summary
                  </Typography>

                  {/* Booking Status */}
                  <Box mb={4}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                      Status
                    </Typography>
                    <Chip 
                      label={booking?.status || 'Confirmed'} 
                      color="success" 
                      icon={<CheckCircleIcon />}
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 'medium',
                        py: 1
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Pricing Breakdown */}
                  <Box mb={4}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                      Price Breakdown
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body1">
                        {pricing?.seatCount || seats?.length || 1} seat(s) × ${pricing?.pricePerSeat || showtime?.price?.base || 10}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ${pricing?.subtotal || '0.00'}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body1">Convenience Fee</Typography>
                      <Typography variant="body1" fontWeight="medium">$2.00</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={3}>
                      <Typography variant="body1">Tax (10%)</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ${pricing?.tax || '0.00'}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h5" fontWeight="bold">Total Paid</Typography>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        ${pricing?.total || booking?.totalAmount?.toFixed(2) || '0.00'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Payment Method */}
                  <Box mb={4}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                      Payment Method
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Credit Card (**** **** **** 1234)
                    </Typography>
                    <Chip 
                      label="Payment Successful" 
                      color="success" 
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Contact Information */}
                  <Box mb={4}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                      Theater Contact
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {theater?.contact?.phone}
                    </Typography>
                    <Typography variant="body2">
                      {theater?.contact?.email}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Stack spacing={3}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => navigate('/my-bookings')}
                        size="large"
                        startIcon={<ReceiptIcon />}
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                          }
                        }}
                      >
                        View My Bookings
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth
                        onClick={() => navigate('/')}
                        startIcon={<HomeIcon />}
                        size="large"
                        sx={{
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 'medium',
                          borderRadius: 3,
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                          color: theme.palette.primary.main,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            background: alpha(theme.palette.primary.main, 0.05),
                          }
                        }}
                      >
                        Back to Home
                      </Button>
                    </motion.div>

                    {/* Additional Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="text"
                          startIcon={<DownloadIcon />}
                          sx={{
                            borderRadius: 2,
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.05),
                              color: theme.palette.primary.main
                            }
                          }}
                        >
                          Download
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="text"
                          startIcon={<ShareIcon />}
                          sx={{
                            borderRadius: 2,
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.05),
                              color: theme.palette.primary.main
                            }
                          }}
                        >
                          Share
                        </Button>
                      </motion.div>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
