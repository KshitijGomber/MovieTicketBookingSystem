import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchShow } from '../api/shows';
import { getBookedSeats, createBooking } from '../api/bookings';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Alert, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Chip,
  Paper
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const TOTAL_SEATS = 30;

const ShowDetails = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedShowTime, setSelectedShowTime] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: show, isLoading, isError } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => fetchShow(showId),
  });

  const { data: bookedSeatsData } = useQuery({
    queryKey: ['bookedSeats', showId, selectedShowTime],
    queryFn: () => getBookedSeats(showId, selectedShowTime),
    enabled: !!selectedShowTime,
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      setSnackbar({ open: true, message: 'Booking successful!', severity: 'success' });
      queryClient.invalidateQueries(['show', showId]);
      queryClient.invalidateQueries(['bookedSeats', showId, selectedShowTime]);
      setSelectedSeats([]);
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
      if (error.message && (error.message.includes('401') || error.message.toLowerCase().includes('token')) ) {
        navigate('/signin');
      }
    },
  });

  if (isLoading) return <CircularProgress />;
  if (isError || !show) return <Alert severity="error">Show not found.</Alert>;

  const bookedSeats = bookedSeatsData?.bookedSeats || [];
  const seats = Array.from({ length: TOTAL_SEATS }, (_, i) => ({
    number: i + 1,
    available: !bookedSeats.includes(i + 1),
  }));

  const handleSeatClick = (seat) => {
    if (!seat.available || !selectedShowTime) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seat.number)) {
        return prev.filter(s => s !== seat.number);
      } else {
        return [...prev, seat.number];
      }
    });
  };

  const handleBookNow = () => {
    if (!token) {
      navigate('/signin');
      return;
    }
    
    if (selectedSeats.length === 0 || !selectedShowTime) {
      setSnackbar({ open: true, message: 'Please select at least one seat and showtime', severity: 'warning' });
      return;
    }

    // Create multiple bookings for selected seats
    const bookingPromises = selectedSeats.map(seat => 
      createBooking({
        showId: show._id,
        seat: seat,
        showTime: selectedShowTime,
      })
    );

    Promise.all(bookingPromises)
      .then(() => {
        setSnackbar({ open: true, message: `Successfully booked ${selectedSeats.length} seat(s)!`, severity: 'success' });
        queryClient.invalidateQueries(['show', showId]);
        queryClient.invalidateQueries(['bookedSeats', showId, selectedShowTime]);
        
        // Navigate to booking confirmation page
        const seatsParam = selectedSeats.join(',');
        const showTimeParam = encodeURIComponent(selectedShowTime);
        navigate(`/booking/${showId}?seats=${seatsParam}&showTime=${showTimeParam}`);
      })
      .catch((error) => {
        setSnackbar({ open: true, message: error.message, severity: 'error' });
        if (error.message && (error.message.includes('401') || error.message.toLowerCase().includes('token')) ) {
          navigate('/signin');
        }
      });
  };

  const isShowFull = bookedSeats.length >= TOTAL_SEATS;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{show.title}</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>{show.description}</Typography>
      
      {selectedShowTime && (
        <Typography variant="subtitle1" gutterBottom>
          Available Seats: {TOTAL_SEATS - bookedSeats.length}
        </Typography>
      )}
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Showtime</InputLabel>
        <Select
          value={selectedShowTime}
          label="Select Showtime"
          onChange={(e) => {
            setSelectedShowTime(e.target.value);
            setSelectedSeats([]); // Clear selected seats when showtime changes
          }}
        >
          {show.showTimes.map((time) => (
            <MenuItem key={time} value={time}>{time}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {isShowFull && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          This show is fully booked for all showtimes.
        </Alert>
      )}

      {selectedShowTime && (
        <>
          <Box sx={{ my: 3 }}>
            <Typography variant="h6">Seat Map for {selectedShowTime}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Green: Available | Red: Booked | Yellow: Your Selection
            </Typography>
            
            {selectedSeats.length > 0 && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Selected Seats: {selectedSeats.join(', ')}
                </Typography>
                <Typography variant="body2">
                  Total: ${selectedSeats.length * 10} (${10} per seat)
                </Typography>
              </Paper>
            )}
            
            <Grid container spacing={1}>
              {seats.map(seat => (
                <Grid item key={seat.number} xs={1}>
                  <Button
                    variant={selectedSeats.includes(seat.number) ? 'contained' : 'outlined'}
                    color={
                      selectedSeats.includes(seat.number) ? 'warning' :
                      seat.available ? 'success' : 'error'
                    }
                    disabled={!seat.available}
                    size="small"
                    sx={{ 
                      minWidth: 36,
                      '&.Mui-disabled': {
                        backgroundColor: !seat.available ? 'red' : undefined,
                        color: !seat.available ? 'white' : undefined
                      }
                    }}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat.number}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {!token && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please log in to book tickets.
            </Alert>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }} 
            onClick={handleBookNow}
            disabled={selectedSeats.length === 0 || !selectedShowTime || !token}
          >
            Book Now
          </Button>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShowDetails; 