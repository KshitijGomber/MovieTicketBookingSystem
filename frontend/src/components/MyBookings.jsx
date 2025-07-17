import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Typography, 
  Paper, 
  Button, 
  Alert, 
  CircularProgress, 
  Snackbar,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Divider
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, cancelBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Event,
  AccessTime,
  EventSeat,
  AttachMoney,
  Cancel,
  CheckCircle,
  LocalMovies,
  LocationOn,
  ConfirmationNumber
} from '@mui/icons-material';

const MyBookings = () => {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { token } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(false);

  const { data: bookings, isLoading, isError, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    retry: false,
    onError: (err) => {
      if (err.message && (err.message.includes('401') || err.message.toLowerCase().includes('token')) ) {
        setAuthError(true);
      }
    }
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: (data) => {
      // Update the bookings list optimistically
      queryClient.setQueryData(['bookings'], (oldData) => {
        if (!oldData) return [];
        return oldData.map(booking => 
          booking._id === data.booking._id ? { ...booking, status: 'cancelled' } : booking
        );
      });
      
      setSnackbar({ 
        open: true, 
        message: data.message || 'Booking cancelled successfully!',
        severity: 'success' 
      });
      
      // Invalidate and refetch to ensure UI is in sync
      queryClient.invalidateQueries(['bookings']);
    },
    onError: (error) => {
      console.error('Cancellation error:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to cancel booking. Please try again.', 
        severity: 'error' 
      });
      
      if (error.message && (error.message.includes('401') || error.message.toLowerCase().includes('token'))) {
        setAuthError(true);
      }
    },
  });

  useEffect(() => {
    if (!token || authError) {
      navigate('/signin');
    }
  }, [token, authError, navigate]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <LocalMovies sx={{ fontSize: 48, color: 'primary.main' }} />
        </motion.div>
        <Typography variant="h6" color="text.secondary">
          Loading your bookings...
        </Typography>
      </Box>
    );
  }

  if (isError && !authError) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert 
          severity="error"
          sx={{
            borderRadius: 3,
            p: 3,
            fontSize: '1.1rem'
          }}
        >
          Failed to load bookings. Please try again later.
        </Alert>
      </Container>
    );
  }

  const activeBookings = bookings?.filter(b => b.status === 'booked') || [];
  const cancelledBookings = bookings?.filter(b => b.status === 'cancelled') || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'success';
      case 'cancelled': return 'error';
      case 'pending_payment': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked': return <CheckCircle sx={{ fontSize: 20 }} />;
      case 'cancelled': return <Cancel sx={{ fontSize: 20 }} />;
      default: return <AccessTime sx={{ fontSize: 20 }} />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2,
                letterSpacing: '-0.02em'
              }}
            >
              My Bookings
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.125rem' }
              }}
            >
              Manage your movie tickets and reservations
            </Typography>
          </Box>
        </motion.div>

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              🎟️ Active Bookings
            </Typography>

            <Grid container spacing={3} sx={{ mb: 6 }}>
              <AnimatePresence>
                {activeBookings.map((booking, index) => (
                  <Grid item xs={12} md={6} lg={4} key={booking._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      style={{ height: '100%' }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          borderRadius: 4,
                          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(102,126,234,0.2)',
                          }
                        }}
                      >
                        {/* Status Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 2
                          }}
                        >
                          <Chip
                            icon={getStatusIcon(booking.status)}
                            label={booking.status.replace('_', ' ').toUpperCase()}
                            color={getStatusColor(booking.status)}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              '& .MuiChip-icon': {
                                color: 'inherit'
                              }
                            }}
                          />
                        </Box>

                        <CardContent sx={{ p: 3 }}>
                          {/* Movie Title */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 2,
                              fontSize: '1.125rem',
                              color: 'text.primary',
                              pr: 4 // Space for status badge
                            }}
                          >
                            {booking.show?.title || 'Movie Title'}
                          </Typography>

                          {/* Booking Details */}
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTime sx={{ fontSize: 18, color: 'primary.main' }} />
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Showtime:</strong> {booking.showTime}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EventSeat sx={{ fontSize: 18, color: 'primary.main' }} />
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Seats:</strong> {Array.isArray(booking.seat) ? booking.seat.join(', ') : booking.seat}
                              </Typography>
                            </Box>

                            {booking.theater && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn sx={{ fontSize: 18, color: 'primary.main' }} />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  <strong>Theater:</strong> {booking.theater.name}
                                </Typography>
                              </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AttachMoney sx={{ fontSize: 18, color: 'primary.main' }} />
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Total:</strong> ${booking.totalPrice || '9.99'}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Event sx={{ fontSize: 18, color: 'primary.main' }} />
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Booked:</strong> {new Date(booking.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Stack>

                          <Divider sx={{ my: 2 }} />

                          {/* Actions */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              fullWidth
                              variant="outlined"
                              color="error"
                              onClick={() => cancelMutation.mutate(booking._id)}
                              disabled={cancelMutation.isLoading}
                              startIcon={<Cancel />}
                              sx={{
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: 600,
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 8px 25px rgba(244,67,54,0.3)'
                                }
                              }}
                            >
                              {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel Booking'}
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </motion.div>
        )}

        {/* Empty State for Active Bookings */}
        {activeBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 4,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(0,0,0,0.08)',
                mb: 4
              }}
            >
              <ConfirmationNumber 
                sx={{ 
                  fontSize: 64, 
                  color: 'text.disabled',
                  mb: 2 
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 1 
                }}
              >
                No Active Bookings
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 3 
                }}
              >
                You haven't booked any movies yet. Start exploring our collection!
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
                onClick={() => navigate('/movies')}
              >
                Browse Movies
              </Button>
            </Paper>
          </motion.div>
        )}

        {/* Cancelled Bookings */}
        {cancelledBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              🚫 Cancelled Bookings
            </Typography>

            <Grid container spacing={3}>
              {cancelledBookings.map((booking, index) => (
                <Grid item xs={12} md={6} lg={4} key={booking._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ height: '100%' }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        background: 'linear-gradient(145deg, #fafafa 0%, #f0f0f0 100%)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        opacity: 0.7,
                        position: 'relative'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: '1.125rem',
                              color: 'text.secondary'
                            }}
                          >
                            {booking.show?.title || 'Movie Title'}
                          </Typography>
                          <Chip
                            icon={<Cancel sx={{ fontSize: 16 }} />}
                            label="CANCELLED"
                            color="error"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Stack spacing={1.5}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <strong>Showtime:</strong> {booking.showTime}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <strong>Seats:</strong> {Array.isArray(booking.seat) ? booking.seat.join(', ') : booking.seat}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <strong>Cancelled:</strong> {new Date(booking.updatedAt || booking.createdAt).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              borderRadius: 3,
              fontWeight: 600
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default MyBookings; 