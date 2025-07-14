import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Alert, 
  CircularProgress,
  Chip,
  Paper,
  Container,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ArrowBack, AccessTime, Star, AttachMoney, PlayArrow } from '@mui/icons-material';
import { fetchShow } from '../api/shows';
import { getTheatersForMovie } from '../api/theaters';
import TheaterSelection from '../components/TheaterSelection';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Fetch movie details
  const { data: movie, isLoading: isLoadingMovie, error: movieError } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchShow(id)
  });

  // Fetch theaters for this movie
  const { data: theaters, isLoading: isLoadingTheaters } = useQuery({
    queryKey: ['theaters', id],
    queryFn: () => getTheatersForMovie(id),
    enabled: !!id
  });

  const handleTheaterSelect = (theater) => {
    setSelectedTheater(theater);
    setSelectedShowtime(null); // Reset showtime when theater changes
  };

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
  };

  const handleBookNow = () => {
    if (!token) {
      navigate('/signin', { state: { from: `/movies/${id}` } });
      return;
    }

    if (!selectedTheater || !selectedShowtime) {
      alert('Please select a theater and showtime first');
      return;
    }

    // Navigate to booking page with all necessary data
    navigate(`/book/${id}`, {
      state: {
        movie,
        theater: selectedTheater,
        showtime: selectedShowtime
      }
    });
  };

  if (isLoadingMovie) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (movieError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Error loading movie details: {movieError.message}
        </Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/movies')}
          sx={{ mt: 2 }}
        >
          Back to Movies
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/movies')}
        sx={{ mb: 3 }}
      >
        Back to Movies
      </Button>

      <Grid container spacing={4}>
        {/* Movie Poster */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <img 
              src={movie?.image} 
              alt={movie?.title}
              style={{ 
                width: '100%', 
                height: 'auto',
                maxHeight: '600px',
                objectFit: 'cover'
              }}
            />
          </Paper>
        </Grid>

        {/* Movie Details */}
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {movie?.title}
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              <Chip icon={<AccessTime />} label={`${movie?.duration} min`} />
              <Chip label={movie?.genre} color="primary" variant="outlined" />
              <Chip label={movie?.language} color="secondary" variant="outlined" />
              <Chip 
                icon={<AttachMoney />}
                label={`From $${movie?.price}`}
                color="success"
                variant="outlined"
              />
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
              Synopsis
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {movie?.description}
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Theater Selection */}
            <Typography variant="h5" gutterBottom>
              Select Theater & Showtime
            </Typography>
            
            {isLoadingTheaters ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : theaters && theaters.length > 0 ? (
              <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <TheaterSelection
                  theaters={theaters}
                  selectedTheater={selectedTheater}
                  onTheaterSelect={handleTheaterSelect}
                  selectedShowtime={selectedShowtime}
                  onShowtimeSelect={handleShowtimeSelect}
                />
              </Paper>
            ) : (
              <Alert severity="info" sx={{ mb: 4 }}>
                No theaters found for this movie. Please check back later.
              </Alert>
            )}

            {/* Book Now Button */}
            {selectedTheater && selectedShowtime && (
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={handleBookNow}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    }
                  }}
                >
                  Book Now at {selectedTheater.name}
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedShowtime.showTime} • {selectedShowtime.availableSeats} seats available
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetailsPage;
