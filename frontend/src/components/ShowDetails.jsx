import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchShow } from '../api/shows';
import { getBookedSeats } from '../api/bookings';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Alert, 
  CircularProgress,
  Chip,
  Paper,
  Breadcrumbs,
  Snackbar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Movie, EventSeat, ArrowBack } from '@mui/icons-material';

const ShowDetails = () => {
  const { showId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [selectedShowTime, setSelectedShowTime] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Check for showTime in URL params
  useEffect(() => {
    const showTimeParam = searchParams.get('showTime');
    if (showTimeParam) {
      setSelectedShowTime(showTimeParam);
    }
  }, [searchParams]);

  const { data: show, isLoading, isError, error } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => fetchShow(showId),
  });

  const { data: bookedSeatsData, isLoading: isLoadingSeats } = useQuery({
    queryKey: ['bookedSeats', showId, selectedShowTime],
    queryFn: () => getBookedSeats(showId, selectedShowTime),
    enabled: !!selectedShowTime,
    onError: (error) => {
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to load seat availability', 
        severity: 'error' 
      });
    }
  });

  const handleBookNow = () => {
    if (!selectedShowTime) {
      setSnackbar({ open: true, message: 'Please select a show time', severity: 'warning' });
      return;
    }
    
    // Navigate to the new booking page with show time parameter
    navigate(`/book/${showId}?showTime=${encodeURIComponent(selectedShowTime)}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading || isLoadingSeats) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error.message || 'Failed to load show details'}
      </Alert>
    );
  }

  if (!show) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        Show not found
      </Alert>
    );
  }

  const availableSeats = 30 - (bookedSeatsData?.bookedSeats?.length || 0);
  const isShowFull = availableSeats <= 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBack />} 
          color="inherit"
          size="small"
        >
          Back to Movies
        </Button>
      </Breadcrumbs>

      {isShowFull && selectedShowTime && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          This showtime is fully booked. Please select another time.
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img
            src={show.posterUrl || 'https://via.placeholder.com/300x450'}
            alt={show.title}
            style={{ 
              width: '100%', 
              borderRadius: 8, 
              boxShadow: 3,
              marginBottom: 16,
              aspectRatio: '2/3',
              objectFit: 'cover'
            }}
          />
          
          {token && selectedShowTime && (
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              onClick={handleBookNow}
              disabled={isShowFull}
              sx={{ 
                py: 1.5, 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none'
              }}
              startIcon={<EventSeat />}
            >
              {isShowFull ? 'Fully Booked' : 'Book Now'}
            </Button>
          )}
          
          {!token && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Please sign in to book tickets
            </Alert>
          )}
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography variant="h3" gutterBottom>
            {show.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip label={show.language} variant="outlined" />
            <Chip label={`${show.duration} min`} variant="outlined" />
            <Chip label={show.genre} variant="outlined" />
            <Chip 
              label={`Rating: ${show.rating || 'N/A'}/10`} 
              color="primary" 
              variant="outlined" 
              icon={<Movie fontSize="small" />}
            />
          </Box>
          
          <Typography variant="h5" gutterBottom>About the Movie</Typography>
          <Typography paragraph sx={{ mb: 3 }}>{show.description}</Typography>
          
          <Typography variant="h5" gutterBottom>Show Times</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {show.showTimes?.map((time) => (
              <Button
                key={time}
                variant={selectedShowTime === time ? 'contained' : 'outlined'}
                color={selectedShowTime === time ? 'primary' : 'inherit'}
                onClick={() => setSelectedShowTime(time)}
                sx={{
                  minWidth: 120,
                  py: 1.5,
                  borderRadius: 2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Button>
            ))}
          </Box>
          
          {selectedShowTime && (
            <>
              <Typography variant="h5" gutterBottom>Seat Map</Typography>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gap: 1,
                  mb: 3
                }}>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((seatNum) => {
                    const isBooked = bookedSeatsData?.bookedSeats?.includes(seatNum);
                    return (
                      <Button
                        key={seatNum}
                        variant="outlined"
                        color={isBooked ? 'error' : 'primary'}
                        disabled={isBooked}
                        sx={{
                          minWidth: '40px',
                          bgcolor: isBooked ? 'error.light' : 'background.paper',
                          '&:hover': {
                            bgcolor: isBooked ? 'error.light' : 'action.hover',
                          },
                        }}
                      >
                        {seatNum}
                      </Button>
                    );
                  })}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: 'primary.main', borderRadius: 1 }} />
                    <Typography variant="body2">Available</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, bgcolor: 'error.light', borderRadius: 1 }} />
                    <Typography variant="body2">Booked</Typography>
                  </Box>
                </Box>
              </Paper>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h6">
                  Available Seats: {availableSeats} of 30
                </Typography>
                {isShowFull && (
                  <Chip 
                    label="Fully Booked" 
                    color="error" 
                    variant="outlined" 
                    size="small" 
                  />
                )}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShowDetails; 