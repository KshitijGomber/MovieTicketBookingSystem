import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchShow } from '../api/shows';
import { Box, Typography, Container, Button, CircularProgress, Alert } from '@mui/material';
import SeatSelection from '../components/SeatSelection';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTime, setShowTime] = useState('');
  
  // Check if coming from show details with seat selection
  useEffect(() => {
    if (location.state?.selectedSeats) {
      setSelectedSeats(location.state.selectedSeats);
      setShowTime(location.state.showTime);
    }
  }, [location.state]);

  // Fetch show details
  const { data: show, isLoading, isError, error } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => fetchShow(showId),
    enabled: !!showId,
  });

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  const handleTimeSelect = (time) => {
    setShowTime(time);
    setSelectedSeats([]); // Clear selected seats when time changes
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      // Show error or alert to select seats
      return;
    }

    navigate(`/shows/${showId}`, {
      state: { 
        selectedSeats,
        showTime: showTime || show?.timings?.[0],
        fromBookingPage: true
      },
      replace: true
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        {error.message || 'Failed to load show details'}
      </Alert>
    );
  }

  if (!show) {
    return (
      <Alert severity="warning" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        Show not found
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Tickets for {show.title}
      </Typography>
      
      <Box mt={4}>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>Select Show Time:</Typography>
          <Box display="flex" gap={2} mb={3}>
            {show.timings.map((time) => (
              <Button
                key={time}
                variant={showTime === time ? 'contained' : 'outlined'}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </Box>
        </Box>

        {showTime ? (
          <>
            <SeatSelection
              showId={showId}
              showTime={showTime}
              onSelectSeats={handleSeatSelection}
            />
            
            {selectedSeats.length > 0 && (
              <Box mt={3} textAlign="center">
                <Typography variant="h6" gutterBottom>
                  Selected Seats: {selectedSeats.join(', ')}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout ({selectedSeats.length} seats)
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography color="textSecondary">
            Please select a show time to see available seats
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default BookingPage;
