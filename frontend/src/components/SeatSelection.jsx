import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { getBookedSeats } from '../api/bookings';

const SeatSelection = ({ showId, showTime, onSeatsSelected }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const data = await getBookedSeats(showId, showTime);
        setBookedSeats(data.bookedSeats || []);
      } catch (err) {
        setError('Failed to load seat availability');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [showId, showTime]);

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatNumber)
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const renderSeat = (seatNumber) => {
    const isSelected = selectedSeats.includes(seatNumber);
    const isBooked = bookedSeats.includes(seatNumber);
    
    return (
      <Grid item xs={2} key={seatNumber}>
        <Paper
          onClick={() => !isBooked && toggleSeat(seatNumber)}
          sx={{
            p: 1,
            textAlign: 'center',
            cursor: isBooked ? 'not-allowed' : 'pointer',
            bgcolor: isBooked ? 'error.light' : isSelected ? 'primary.main' : 'grey.200',
            color: isSelected ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: isBooked ? 'error.light' : isSelected ? 'primary.dark' : 'grey.300',
            },
          }}
        >
          {seatNumber}
        </Paper>
      </Grid>
    );
  };

  const renderSeatLayout = () => {
    const rows = [];
    const seatsPerRow = 10;
    const totalSeats = 50;

    for (let i = 0; i < totalSeats; i += seatsPerRow) {
      const rowSeats = [];
      for (let j = 1; j <= seatsPerRow; j++) {
        const seatNumber = i + j;
        rowSeats.push(renderSeat(seatNumber));
      }
      rows.push(
        <Grid container spacing={1} key={`row-${i}`} sx={{ mb: 1 }}>
          {rowSeats}
        </Grid>
      );
    }
    return rows;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Seats
      </Typography>
      
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: 'grey.200', borderRadius: 1 }} />
            <Typography variant="body2">Available</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: 'primary.main', borderRadius: 1 }} />
            <Typography variant="body2">Selected</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: 'error.light', borderRadius: 1 }} />
            <Typography variant="body2">Booked</Typography>
          </Box>
        </Box>
        
        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
          <Paper sx={{ p: 2, mb: 2, textAlign: 'center' }}>
            Screen
          </Paper>
          {renderSeatLayout()}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography>
          Selected: {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} 
          (${selectedSeats.length * 10})
        </Typography>
        <Button
          variant="contained"
          disabled={selectedSeats.length === 0}
          onClick={() => onSeatsSelected(selectedSeats)}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default SeatSelection;
