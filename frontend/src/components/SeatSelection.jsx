import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { getBookedSeats } from '../api/bookings';

const SeatSelection = ({ showId, showTime, theaterId, onSelectSeats, onSeatsSelected }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!showId || !showTime) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching booked seats for:', { showId, showTime, theaterId });
        const response = await getBookedSeats(showId, showTime, theaterId);
        console.log('Raw API response:', response);
        
        // Handle both array and object responses
        let booked = [];
        if (Array.isArray(response)) {
          booked = response;
        } else if (response && Array.isArray(response.bookedSeats)) {
          booked = response.bookedSeats;
        } else if (response && response.data && Array.isArray(response.data)) {
          booked = response.data;
        }
        
        console.log('Processed booked seats:', booked);
        setBookedSeats(booked);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booked seats:', error);
        setError('Failed to load seat availability');
        setLoading(false);
        // Set empty array on error so seats still display
        setBookedSeats([]);
      }
    };
    
    fetchBookedSeats();
    
    const intervalId = setInterval(fetchBookedSeats, 30000); // Poll every 30 seconds
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [showId, showTime, theaterId]);

  const isSeatBooked = (seatNumber) => {
    return Array.isArray(bookedSeats) 
      ? bookedSeats.some(seat => 
          typeof seat === 'string' 
            ? seat === seatNumber.toString() || seat === `${seatNumber}`
            : seat.seatNumber === seatNumber || seat === seatNumber
        )
      : false; // Default to available if not array
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
    const isBooked = isSeatBooked(seatNumber);
    
    return (
      <Grid item xs={2} key={seatNumber}>
        <Paper
          onClick={() => !isBooked && toggleSeat(seatNumber)}
          sx={{
            p: 1,
            textAlign: 'center',
            cursor: isBooked ? 'not-allowed' : 'pointer',
            bgcolor: isBooked ? 'error.light' : isSelected ? 'primary.main' : 'grey.200',
            color: isSelected || isBooked ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: isBooked ? 'error.light' : isSelected ? 'primary.dark' : 'grey.300',
            },
            border: isBooked ? '2px solid' : '1px solid',
            borderColor: isBooked ? 'error.main' : 'transparent'
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            {seatNumber}
          </Typography>
        </Paper>
      </Grid>
    );
  };

  const renderSeatLayout = () => {
    const rows = [];
    const seatsPerRow = 10;
    const totalSeats = 100; // Increased for better theater experience

    for (let i = 0; i < totalSeats; i += seatsPerRow) {
      const rowLetter = String.fromCharCode(65 + Math.floor(i / seatsPerRow)); // A, B, C, etc.
      const rowSeats = [];
      
      for (let j = 1; j <= seatsPerRow; j++) {
        const seatNumber = `${rowLetter}${j}`;
        rowSeats.push(renderSeat(seatNumber));
      }
      
      rows.push(
        <Box key={`row-${rowLetter}`} sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" sx={{ minWidth: 20, fontWeight: 'bold' }}>
              {rowLetter}
            </Typography>
            <Grid container spacing={0.5} sx={{ flex: 1 }}>
              {rowSeats}
            </Grid>
          </Box>
        </Box>
      );
    }
    return rows;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading seat availability...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Showing seats with default availability
        </Typography>
      </Box>
    );
  }

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
        <Typography variant="h6">
          Selected: {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} 
          <Typography component="span" color="primary.main" sx={{ ml: 1, fontWeight: 'bold' }}>
            (₹{selectedSeats.length * 200})
          </Typography>
        </Typography>
        <Button
          variant="contained"
          size="large"
          disabled={selectedSeats.length === 0}
          onClick={() => onSeatsSelected && onSeatsSelected(selectedSeats)}
          sx={{ 
            minWidth: 160,
            '&:disabled': {
              bgcolor: 'grey.300'
            }
          }}
        >
          {selectedSeats.length === 0 ? 'Select Seats' : 'Proceed to Payment'}
        </Button>
      </Box>
    </Box>
  );
};

export default SeatSelection;
