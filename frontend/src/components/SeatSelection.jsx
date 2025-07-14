import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';

const SeatSelection = ({ totalSeats = 30, bookedSeats = [], onSeatSelection, selectedSeats = [] }) => {
  const [internalSelectedSeats, setInternalSelectedSeats] = useState(selectedSeats);

  // Update internal state when external selectedSeats change
  useEffect(() => {
    setInternalSelectedSeats(selectedSeats);
  }, [selectedSeats]);

  const isSeatBooked = (seatNumber) => {
    return Array.isArray(bookedSeats) 
      ? bookedSeats.some(seat => 
          typeof seat === 'string' 
            ? seat === seatNumber 
            : seat.seatNumber === seatNumber || seat === seatNumber
        )
      : bookedSeats === seatNumber;
  };

  const toggleSeat = (seatNumber) => {
    if (isSeatBooked(seatNumber)) return;
    
    const newSelectedSeats = internalSelectedSeats.includes(seatNumber)
      ? internalSelectedSeats.filter(seat => seat !== seatNumber)
      : [...internalSelectedSeats, seatNumber];
    
    setInternalSelectedSeats(newSelectedSeats);
    
    // Call the parent callback
    if (onSeatSelection) {
      onSeatSelection(newSelectedSeats);
    }
  };
  const renderSeat = (seatNumber) => {
    const isSelected = internalSelectedSeats.includes(seatNumber);
    const isBooked = isSeatBooked(seatNumber);
    
    return (
      <Grid item xs={1.2} key={seatNumber}>
        <Paper
          onClick={() => !isBooked && toggleSeat(seatNumber)}
          sx={{
            p: 1,
            textAlign: 'center',
            cursor: isBooked ? 'not-allowed' : 'pointer',
            bgcolor: isBooked ? 'error.light' : isSelected ? 'primary.main' : 'grey.200',
            color: isSelected || isBooked ? 'white' : 'inherit',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
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
    const actualTotalSeats = Math.min(totalSeats, 50); // Cap at 50 seats for UI

    for (let i = 0; i < actualTotalSeats; i += seatsPerRow) {
      const rowSeats = [];
      const rowLetter = String.fromCharCode(65 + Math.floor(i / seatsPerRow)); // A, B, C, etc.
      
      for (let j = 1; j <= seatsPerRow && (i + j - 1) < actualTotalSeats; j++) {
        const seatNumber = `${rowLetter}${j}`;
        rowSeats.push(renderSeat(seatNumber));
      }
      
      rows.push(
        <Box key={`row-${i}`} sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Row {rowLetter}
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            {rowSeats}
          </Grid>
        </Box>
      );
    }
    return rows;
  };

  return (
    <Box>
      {/* Screen */}
      <Box sx={{ mb: 3 }}>
        <Paper 
          sx={{ 
            p: 2, 
            textAlign: 'center', 
            bgcolor: 'grey.800', 
            color: 'white',
            borderRadius: '20px 20px 5px 5px',
            mb: 4
          }}
        >
          <Typography variant="h6">SCREEN</Typography>
        </Paper>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
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
      
      {/* Seat Layout */}
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        {renderSeatLayout()}
      </Box>
    </Box>
  );
};

export default SeatSelection;
