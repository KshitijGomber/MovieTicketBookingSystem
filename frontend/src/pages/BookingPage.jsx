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
    // Redirect to show details page with selected seats
    navigate(`/shows/${showId}`, {
      state: { 
        selectedSeats: seats,
        showTime: showTime || show?.timings?.[0],
        fromBookingPage: true
      }
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
        <SeatSelection
          showId={showId}
          showTime={showTime}
          onSelectSeats={handleSeatSelection}
          onTimeSelect={setShowTime}
        />
      </Box>
    </Container>
  );
};

export default BookingPage;
