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
      <Box
        key={seatNumber}
        onClick={() => !isBooked && toggleSeat(seatNumber)}
        sx={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          cursor: isBooked ? 'not-allowed' : 'pointer',
          bgcolor: isBooked ? 'error.main' : isSelected ? 'primary.main' : 'grey.300',
          color: isSelected || isBooked ? 'white' : 'text.primary',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          border: '1px solid',
          borderColor: isBooked ? 'error.dark' : isSelected ? 'primary.dark' : 'grey.400',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: isBooked ? 'error.main' : isSelected ? 'primary.dark' : 'grey.400',
            transform: isBooked ? 'none' : 'scale(1.05)',
          },
          boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
        }}
      >
        {seatNumber}
      </Box>
    );
  };

  const renderSeatLayout = () => {
    const rows = [];
    const seatsPerRow = 5; // Reduced for better UX
    const totalRows = 4; // 4 rows = 20 seats total
    const totalSeats = totalRows * seatsPerRow;

    for (let row = 0; row < totalRows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // A, B, C, D
      const rowSeats = [];
      
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = `${rowLetter}${seat}`;
        rowSeats.push(renderSeat(seatNumber));
      }
      
      rows.push(
        <Box key={`row-${rowLetter}`} sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                minWidth: 20, 
                fontWeight: 'bold',
                color: 'text.secondary',
                mr: 1
              }}
            >
              {rowLetter}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {rowSeats}
            </Box>
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Select Seats
      </Typography>
      
      {/* Legend */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 3, 
        mb: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: 'grey.300', borderRadius: 0.5 }} />
          <Typography variant="body2" color="text.secondary">Available</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', borderRadius: 0.5 }} />
          <Typography variant="body2" color="text.secondary">Selected</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: 'error.main', borderRadius: 0.5 }} />
          <Typography variant="body2" color="text.secondary">Booked</Typography>
        </Box>
      </Box>
      
      {/* Theater Layout */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {/* Screen */}
        <Box sx={{ 
          mb: 4,
          p: 2,
          bgcolor: 'grey.100',
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'grey.300',
          maxWidth: 300,
          mx: 'auto'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            SCREEN
          </Typography>
        </Box>
        
        {/* Seats */}
        <Box sx={{ 
          display: 'inline-block',
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          {renderSeatLayout()}
        </Box>
      </Box>
      
      {/* Selection Summary */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        mt: 3,
        p: 3,
        bgcolor: selectedSeats.length > 0 ? 'primary.50' : 'background.paper',
        borderRadius: 3,
        border: '2px solid',
        borderColor: selectedSeats.length > 0 ? 'primary.main' : 'divider',
        transition: 'all 0.3s ease'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {selectedSeats.length === 0 ? (
              'Please select your seats'
            ) : (
              <>Selected: {selectedSeats.join(', ')}</>
            )}
          </Typography>
          {selectedSeats.length > 0 && (
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} × ${(9.99).toFixed(2)} = ${(selectedSeats.length * 9.99).toFixed(2)}
            </Typography>
          )}
          {selectedSeats.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Click on available seats to select them
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SeatSelection;
