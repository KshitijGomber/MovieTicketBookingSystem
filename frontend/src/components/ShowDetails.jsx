import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchShow } from '../api/shows';
import { Typography, Button, Box, Grid, Alert, CircularProgress } from '@mui/material';

const TOTAL_SEATS = 30;

const ShowDetails = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const { data: show, isLoading, isError } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => fetchShow(showId),
  });

  if (isLoading) return <CircularProgress />;
  if (isError || !show) return <Alert severity="error">Show not found.</Alert>;

  // Mock seat map: first N seats are booked, rest are available
  const bookedSeats = TOTAL_SEATS - show.availableSeats;
  const seats = Array.from({ length: TOTAL_SEATS }, (_, i) => ({
    number: i + 1,
    available: i >= bookedSeats,
  }));

  const handleSeatClick = (seat) => {
    if (seat.available) setSelectedSeat(seat.number);
  };

  const handleBookNow = () => {
    if (selectedSeat) {
      navigate(`/booking/${show._id}`, { state: { seat: selectedSeat } });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{show.title}</Typography>
      <Typography variant="subtitle1">Showtimes: {show.showTimes.join(', ')}</Typography>
      <Typography variant="subtitle2" gutterBottom>Available Seats: {show.availableSeats}</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>{show.description}</Typography>
      <Box sx={{ my: 3 }}>
        <Typography variant="h6">Seat Map</Typography>
        <Grid container spacing={1}>
          {seats.map(seat => (
            <Grid item key={seat.number} xs={1}>
              <Button
                variant={selectedSeat === seat.number ? 'contained' : 'outlined'}
                color={seat.available ? (selectedSeat === seat.number ? 'primary' : 'success') : 'error'}
                disabled={!seat.available}
                size="small"
                sx={{ minWidth: 36 }}
                onClick={() => handleSeatClick(seat)}
              >
                {seat.number}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBookNow}
        disabled={!selectedSeat}
      >
        Book Now
      </Button>
      {show.availableSeats === 0 && <Alert severity="warning" sx={{ mt: 2 }}>This show is fully booked.</Alert>}
    </Box>
  );
};

export default ShowDetails; 