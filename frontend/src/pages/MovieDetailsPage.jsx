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
  Paper,
  Container,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowBack, 
  AccessTime, 
  AttachMoney, 
  PlayArrow, 
  Movie as MovieIcon,
  Language as LanguageIcon,
  Category as GenreIcon
} from '@mui/icons-material';
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

  // Fetch movie details
  const { data: movie, isLoading: isLoadingMovie, error: movieError } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchShow(id),
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  // Fetch theaters for this movie
  const { data: theaters, isLoading: isLoadingTheaters, error: theatersError } = useQuery({
    queryKey: ['theaters', id],
    queryFn: () => getTheatersForMovie(id),
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!id, // Only run if id exists
  });

  // Debug logging
  console.log('MovieDetailsPage Debug:', {
    id,
    movie: movie ? { title: movie.title, _id: movie._id } : null,
    isLoadingMovie,
    movieError: movieError?.message,
    theaters: theaters ? `${theaters.length} theaters found` : 'No theaters',
    isLoadingTheaters,
    theatersError: theatersError?.message,
    selectedTheater: selectedTheater ? selectedTheater.name : null,
    selectedShowtime
  });

  // Component for movie info cards
  const InfoCard = ({ icon, label, value, color = 'primary.main' }) => (
    <Grid item xs={6} sm={3}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2.5, 
          borderRadius: 2, 
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            elevation: 3,
            borderColor: color,
            transform: 'translateY(-2px)'
          }
        }}
      >
        {icon && React.cloneElement(icon, { sx: { color, mb: 1, fontSize: '1.5rem' } })}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {value}
        </Typography>
      </Paper>
    </Grid>
  );

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
    console.error('Movie fetch error:', movieError);
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

  if (!movie && !isLoadingMovie) {
    console.warn('No movie data found for ID:', id);
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
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/movies')}
          sx={{ 
            mb: 3,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              bgcolor: 'primary.50'
            }
          }}
        >
          Back to Movies
        </Button>
      </Box>

      {/* Main Content */}
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.3s ease-in-out'
              }
            }}
          >
            {movie?.image ? (
              <img 
                src={movie.image} 
                alt={movie.title}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <MovieIcon sx={{ fontSize: '1.5rem' }} />
              </Box>
            )}
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
            {/* Title Section */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' }
                }}
              >
                {movie?.title}
              </Typography>
            </Box>

            {/* Movie Info Cards */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                <InfoCard 
                  icon={<AccessTime />}
                  label="Duration"
                  value={`${movie?.duration} min`}
                  color="primary.main"
                />
                <InfoCard 
                  icon={<GenreIcon />}
                  label="Genre"
                  value={movie?.genre}
                  color="secondary.main"
                />
                <InfoCard 
                  icon={<LanguageIcon />}
                  label="Language"
                  value={movie?.language}
                  color="info.main"
                />
                <InfoCard 
                  icon={<AttachMoney />}
                  label="From"
                  value={`$${movie?.price}`}
                  color="success.main"
                />
              </Grid>
            </Box>

            {/* Synopsis Section */}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                flex: 1,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <MovieIcon sx={{ fontSize: '1.2rem' }} />
                Synopsis
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  lineHeight: 1.8,
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  textAlign: 'justify'
                }}
              >
                {movie?.description || 'No description available for this movie.'}
              </Typography>
            </Paper>

          </Box>
        </Grid>
      </Grid>

      {/* Theater Selection Section */}
      <Box sx={{ mt: 6 }}>
        <Divider sx={{ 
          my: 4,
          '&::before, &::after': {
            borderColor: 'primary.light',
          }
        }} />

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Select Theater & Showtime
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose your preferred theater and showtime to continue booking
          </Typography>
        </Box>
        
        {isLoadingTheaters ? (
          <Paper elevation={2} sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Loading available theaters...
            </Typography>
          </Paper>
        ) : theaters && theaters.length > 0 ? (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <TheaterSelection
              theaters={theaters}
              selectedTheater={selectedTheater}
              onTheaterSelect={handleTheaterSelect}
              selectedShowtime={selectedShowtime}
              onShowtimeSelect={handleShowtimeSelect}
            />
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '2rem'
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No theaters available
              </Typography>
              <Typography variant="body2">
                No theaters found for this movie at the moment. Please check back later or contact support.
              </Typography>
            </Alert>
          </Paper>
        )}

        {/* Book Now Button */}
        {selectedTheater && selectedShowtime && (
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Paper 
              elevation={4}
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                🎬 Ready to Book!
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                {selectedTheater?.name} • {selectedShowtime}
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleBookNow}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  bgcolor: 'white',
                  color: 'primary.main',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.3)'
                  }
                }}
              >
                Book Now
              </Button>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MovieDetailsPage;
