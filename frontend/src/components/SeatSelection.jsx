import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { EventSeat, CheckCircle, Cancel } from '@mui/icons-material';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  borderRadius: '20px',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
  color: 'white',
  margin: '2rem 0',
}));

const SeatButton = styled(motion.div)(({ theme, isSelected, isBooked }) => ({
  padding: theme.spacing(1.5),
  textAlign: 'center',
  cursor: isBooked ? 'not-allowed' : 'pointer',
  borderRadius: '12px',
  minHeight: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: '0.9rem',
  border: '2px solid',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  ...(isBooked && {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    borderColor: '#ff5252',
    color: 'white',
    opacity: 0.7,
  }),
  
  ...(isSelected && !isBooked && {
    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
    borderColor: '#4ecdc4',
    color: 'white',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)',
  }),
  
  ...(!isSelected && !isBooked && {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      transform: 'scale(1.02)',
      boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)',
    }
  }),
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s',
  },
  
  '&:hover::before': {
    left: '100%',
  }
}));

const LegendItem = styled(Box)(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  
  '& .legend-box': {
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    background: color,
    border: '2px solid rgba(255, 255, 255, 0.3)',
  }
}));

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
      <Grid size={{ xs: 2, sm: 1.5, md: 1.2 }} key={seatNumber}>
        <SeatButton
          isSelected={isSelected}
          isBooked={isBooked}
          onClick={() => !isBooked && toggleSeat(seatNumber)}
          whileHover={!isBooked ? { scale: 1.05 } : {}}
          whileTap={!isBooked ? { scale: 0.95 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: seatNumber * 0.02,
            type: "spring",
            stiffness: 100 
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            {isBooked ? (
              <Cancel sx={{ fontSize: 20 }} />
            ) : isSelected ? (
              <CheckCircle sx={{ fontSize: 20 }} />
            ) : (
              <EventSeat sx={{ fontSize: 20 }} />
            )}
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
              {seatNumber}
            </Typography>
          </Box>
        </SeatButton>
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
        <motion.div 
          key={`row-${i}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: Math.floor(i / seatsPerRow) * 0.1 }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                fontSize: '1.1rem'
              }}
            >
              Row {rowLetter}
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {rowSeats}
            </Grid>
          </Box>
        </motion.div>
      );
    }
    return rows;
  };

  return (
    <StyledContainer>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'white',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}
          >
            🎭 Choose Your Seats
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400
            }}
          >
            Select your preferred seats for the best movie experience
          </Typography>
        </Box>

        {/* Screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ mb: 4 }}>
            <Box 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: 'white',
                borderRadius: '25px 25px 8px 8px',
                mb: 4,
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  animation: 'shimmer 3s infinite',
                },
                
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' }
                }
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '2px'
                }}
              >
                🎬 SCREEN
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
            <LegendItem color="rgba(255, 255, 255, 0.2)">
              <div className="legend-box" />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                Available
              </Typography>
            </LegendItem>
            <LegendItem color="linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)">
              <div className="legend-box" />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                Selected
              </Typography>
            </LegendItem>
            <LegendItem color="linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)">
              <div className="legend-box" />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                Booked
              </Typography>
            </LegendItem>
          </Box>
        </motion.div>
        
        {/* Seat Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            {renderSeatLayout()}
          </Box>
        </motion.div>

        {/* Selection Summary */}
        <AnimatePresence>
          {internalSelectedSeats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                sx={{ 
                  mt: 4, 
                  p: 3, 
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'white',
                    mb: 1
                  }}
                >
                  ✨ Selected Seats: {internalSelectedSeats.join(', ')}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500
                  }}
                >
                  Total: {internalSelectedSeats.length} seat{internalSelectedSeats.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </StyledContainer>
  );
};

export default SeatSelection;
