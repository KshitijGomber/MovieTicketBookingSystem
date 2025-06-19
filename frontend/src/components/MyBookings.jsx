import React, { useState } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, Button, Alert, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookings, cancelBooking } from '../api/bookings';

const MyBookings = () => {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });
  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => queryClient.invalidateQueries(['bookings']),
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load bookings.</Alert>;

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>My Bookings</Typography>
      {(!bookings || bookings.length === 0) && <Alert severity="info">No bookings found.</Alert>}
      <List>
        {bookings && bookings.map(b => (
          <ListItem key={b._id} secondaryAction={
            <Button variant="outlined" color="error" onClick={() => cancelMutation.mutate(b._id)} disabled={cancelMutation.isLoading}>
              Cancel
            </Button>
          }>
            <ListItemText
              primary={`${b.show.movie} (${b.show.time})`}
              secondary={`Seat: ${b.seat}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MyBookings; 