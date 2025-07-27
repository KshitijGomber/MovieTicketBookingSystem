import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Alert, 
  CircularProgress,
  Paper,
  Container,
  Divider,
  Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowBack, 
  AccessTime, 
  AttachMoney, 
  PlayArrow, 
  Movie as MovieIcon,
  Language as LanguageIcon,
  Category as GenreIcon,
  Schedule as ScheduleIcon,
  LocalMovies as LocalMoviesIcon
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
    theatersDataType: typeof theaters,
    theatersIsArray: Array.isArray(theaters),
    theatersActualData: theaters,
    isLoadingTheaters,
    theatersError: theatersError?.message,
    selectedTheater: selectedTheater ? selectedTheater.name : null,
    selectedShowtime
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          minHeight: '100vh',
          backgroundImage: movie?.image ? `url(${movie.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: -1,
          }
        }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Box sx={{ mb: 4 }}>
            <Button 
              startIcon={<ArrowBack />} 
              onClick={() => navigate('/movies')}
              sx={{ 
                mb: 3,
                color: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                px: 3,
                py: 1,
                textShadow: '0px 1px 3px rgba(0,0,0,0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }
              }}
            >
              Back to Movies
            </Button>
          </Box>
        </motion.div>

        {/* Main Content */}
        <Grid container spacing={6}>
          {/* Movie Poster */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Paper 
                elevation={20} 
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden',
                  position: 'relative',
                  height: { xs: 500, md: 700 },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
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
                    <LocalMoviesIcon sx={{ fontSize: '4rem' }} />
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Movie Details - Right Side */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Paper
                elevation={12}
                sx={{
                  height: { md: 700 },
                  p: 5,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  }
                }}
              >
                {/* Title Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '3rem', lg: '3.5rem' },
                      textShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                      lineHeight: 1.1
                    }}
                  >
                    {movie?.title}
                  </Typography>
                </Box>

                {/* Movie Info Chips - Modern Layout */}
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Chip
                          icon={<AccessTime />}
                          label={`${movie?.duration} min`}
                          variant="outlined"
                          sx={{
                            width: '100%',
                            height: 48,
                            borderRadius: 3,
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              backgroundColor: 'rgba(102, 126, 234, 0.2)',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Chip
                          icon={<GenreIcon />}
                          label={movie?.genre}
                          variant="outlined"
                          sx={{
                            width: '100%',
                            height: 48,
                            borderRadius: 3,
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(118, 75, 162, 0.1)',
                            borderColor: '#764ba2',
                            color: '#764ba2',
                            '&:hover': {
                              backgroundColor: 'rgba(118, 75, 162, 0.2)',
                              boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)',
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Chip
                          icon={<LanguageIcon />}
                          label={movie?.language}
                          variant="outlined"
                          sx={{
                            width: '100%',
                            height: 48,
                            borderRadius: 3,
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            borderColor: '#4CAF50',
                            color: '#4CAF50',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.2)',
                              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                    
                    <Grid item xs={6} sm={3}>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Chip
                          icon={<AttachMoney />}
                          label={`From $${movie?.price}`}
                          variant="outlined"
                          sx={{
                            width: '100%',
                            height: 48,
                            borderRadius: 3,
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            borderColor: '#FF9800',
                            color: '#FF9800',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 152, 0, 0.2)',
                              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                  </Grid>
                </Box>

                {/* Synopsis Section */}
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 3,
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    <MovieIcon sx={{ fontSize: '1.5rem', color: '#667eea' }} />
                    Synopsis
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.8,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      textAlign: 'justify',
                      color: '#555',
                      mb: 4,
                      textShadow: '0px 1px 1px rgba(0,0,0,0.05)'
                    }}
                  >
                    {movie?.description || 'Experience an unforgettable cinematic journey with stunning visuals, compelling storytelling, and exceptional performances that will keep you at the edge of your seat.'}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Theater Selection Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Box sx={{ mt: 8 }}>
            <Divider sx={{ 
              my: 6,
              '&::before, &::after': {
                borderColor: 'rgba(255,255,255,0.3)',
              }
            }} />

            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'white',
                  mb: 2,
                  textShadow: '0px 2px 8px rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <ScheduleIcon sx={{ fontSize: '2.5rem', color: '#667eea' }} />
                Select Theater & Showtime
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  textShadow: '0px 1px 3px rgba(0,0,0,0.6)'
                }}
              >
                Choose your preferred theater and showtime to continue booking
              </Typography>
            </Box>
            
            {isLoadingTheaters ? (
              <Paper 
                elevation={20} 
                sx={{ 
                  p: 8, 
                  borderRadius: 4, 
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                }}
              >
                <CircularProgress 
                  size={64} 
                  sx={{ 
                    mb: 3,
                    color: '#667eea'
                  }} 
                />
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'medium' }}>
                  Loading available theaters...
                </Typography>
              </Paper>
            ) : theaters && theaters.length > 0 ? (
              <Paper 
                elevation={20} 
                sx={{ 
                  p: 5, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
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
              <Paper 
                elevation={20} 
                sx={{ 
                  p: 6, 
                  borderRadius: 4, 
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: 3,
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    '& .MuiAlert-icon': {
                      fontSize: '2rem'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    No theaters available
                  </Typography>
                  <Typography variant="body1">
                    No theaters found for this movie at the moment. Please check back later or contact support.
                  </Typography>
                </Alert>
              </Paper>
            )}

            {/* Book Now Button */}
            {selectedTheater && selectedShowtime && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                  <Paper 
                    elevation={25}
                    sx={{ 
                      p: 6, 
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)',
                        backgroundSize: '20px 20px',
                        animation: 'shimmer 3s linear infinite',
                      },
                      '@keyframes shimmer': {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(100%)' }
                      }
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 'bold',
                        textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      🎬 Ready to Book!
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 4, 
                        opacity: 0.95,
                        textShadow: '0px 1px 2px rgba(0,0,0,0.3)',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      {selectedTheater?.name} • {selectedShowtime}
                    </Typography>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<PlayArrow />}
                        onClick={handleBookNow}
                        sx={{
                          py: 2.5,
                          px: 8,
                          fontSize: '1.3rem',
                          borderRadius: 4,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          bgcolor: 'white',
                          color: 'primary.main',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                          position: 'relative',
                          zIndex: 1,
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.02)' },
                            '100%': { transform: 'scale(1)' }
                          },
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 12px 35px rgba(0,0,0,0.4)'
                          }
                        }}
                      >
                        Book Now
                      </Button>
                    </motion.div>
                  </Paper>
                </Box>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default MovieDetailsPage;
