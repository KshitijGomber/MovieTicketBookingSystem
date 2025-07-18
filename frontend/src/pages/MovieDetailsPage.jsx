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
import { MovieDetailsSkeleton } from '../components/LoadingSkeleton';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Debug logging
  console.log('MovieDetailsPage - ID from URL:', id);
  console.log('MovieDetailsPage - Movie data:', movie);
  console.log('MovieDetailsPage - Is loading movie:', isLoadingMovie);
  console.log('MovieDetailsPage - Movie error:', movieError);

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
      <MovieDetailsSkeleton />
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

  if (!movie) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Movie not found. Please check the URL and try again.
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
        <Grid item xs={12} md={5} lg={4}>
          <Paper 
            elevation={8} 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden',
              position: 'relative',
              height: { xs: 450, md: 600 },
              '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.3s ease-in-out'
              }
            }}
          >
            <img 
              src={movie?.image} 
              alt={movie?.title}
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Paper>
        </Grid>

        {/* Movie Details - Right Side */}
        <Grid item xs={12} md={7} lg={8}>
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            pl: { md: 2 }
          }}>
            {/* Title */}
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' }
              }}
            >
              {movie?.title}
            </Typography>

            {/* Movie Info Cards */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center'
                  }}>
                    <AccessTime sx={{ color: 'primary.main', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Duration
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {movie?.duration} min
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Genre
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {movie?.genre}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Language
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {movie?.language}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center'
                  }}>
                    <AttachMoney sx={{ color: 'success.main', mb: 1 }} />
                    <Typography variant="caption" color="text.secondary" display="block">
                      From
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      ${movie?.price}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Synopsis - Moved to right side */}
            <Box sx={{ mb: 4, flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Synopsis
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                color="text.secondary" 
                sx={{ 
                  lineHeight: 1.8,
                  fontSize: { xs: '0.95rem', md: '1rem' }
                }}
              >
                {movie?.description}
              </Typography>
            </Box>

          </Box>
        </Grid>
      </Grid>

      {/* Theater Selection Section - Full Width */}
      <Box sx={{ mt: 6 }}>
        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Select Theater & Showtime
        </Typography>
        
        {isLoadingTheaters ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : theaters && theaters.length > 0 ? (
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
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
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={handleBookNow}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Book Now - {selectedTheater?.name}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MovieDetailsPage;
