import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { getBookedSeats } from '../api/bookings';

const SeatSelection = ({ showId, showTime, onSelectSeats, onTimeSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!showId || !showTime) return;
      
      try {
        const booked = await getBookedSeats(showId, showTime);
        console.log('Fetched booked seats:', booked);
        setBookedSeats(booked);
      } catch (error) {
        console.error('Error fetching booked seats:', error);
        // Don't update state on error to prevent UI flicker
      }
    };
    
    fetchBookedSeats();
    
    const intervalId = setInterval(fetchBookedSeats, 10000); // Poll every 10 seconds
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [showId, showTime]);

  const isSeatBooked = (seatNumber) => {
    return Array.isArray(bookedSeats) 
      ? bookedSeats.some(seat => 
          typeof seat === 'string' 
            ? seat === seatNumber 
            : seat.seatNumber === seatNumber || seat === seatNumber
        )
      : bookedSeats === seatNumber; // Fallback for non-array values
  };

  const toggleSeat = (seatNumber) => {
    if (isSeatBooked(seatNumber)) return;
    
    setSelectedSeats(prev => {
      const newSelectedSeats = prev.includes(seatNumber)
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber];
      
      // Call onSelectSeats with the updated seats
      if (onSelectSeats) {
        onSelectSeats(newSelectedSeats);
      }
      
      return newSelectedSeats;
    });
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
