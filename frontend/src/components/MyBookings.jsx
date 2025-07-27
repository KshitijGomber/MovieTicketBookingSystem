import React, { useState, useEffect } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, Button, Alert, CircularProgress, Snackbar } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, cancelBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  if (isLoading) return <CircularProgress />;
  if (isError && !authError) return <Alert severity="error">Failed to load bookings.</Alert>;

  const activeBookings = bookings?.filter(b => b.status === 'booked') || [];

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>My Bookings</Typography>
      
      {activeBookings.length === 0 ? (
        <Alert severity="info">No active bookings found.</Alert>
      ) : (
        <List>
          {activeBookings.map(booking => (
            <ListItem 
              key={booking._id} 
              sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                mb: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }
              }}
            >
              <ListItemText
                primary={booking.show?.title || booking.movieTitle || 'Movie Title Not Available'}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      Showtime: {booking.showTime} | Seats: {Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seat || booking.seats}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.secondary">
                      Theater: {booking.theater?.name || 'Theater Not Specified'} | Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      Total: ${booking.totalAmount || 'N/A'}
                    </Typography>
                  </>
                }
                sx={{ flex: 1 }}
              />
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => cancelMutation.mutate(booking._id)} 
                disabled={cancelMutation.isLoading}
                sx={{ mt: { xs: 1, sm: 0 } }}
              >
                {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel'}
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default MyBookings; 