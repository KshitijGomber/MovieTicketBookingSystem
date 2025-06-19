import React from 'react';
import { Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../api/bookings';

const MyBookings = () => {
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
    retry: false, // Don't retry if it fails
  });

  if (isLoading) return <CircularProgress />;
  
  // Since the bookings API isn't fully implemented yet, show a message
  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>My Bookings</Typography>
      <Alert severity="info">
        Booking functionality is coming soon! You'll be able to view and manage your bookings here.
      </Alert>
    </Paper>
  );
};

export default MyBookings; 