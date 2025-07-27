import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Stack
} from '@mui/material';
import { PlayArrow, Star } from '@mui/icons-material';
import { MovieCardSkeleton } from './LoadingSkeleton';

const MovieGrid = ({ movies, loading }) => {
  if (loading) {
    return (
      <MovieCardSkeleton count={8} />
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}
          >
            Featured Movies
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'primary.main',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              '&:hover': { 
                textDecoration: 'underline',
                color: 'primary.dark'
              },
              transition: 'all 0.2s ease'
            }}
          >
            View All →
          </Typography>
        </Box>
      </motion.div>

      {/* Movies Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
      >
        <Grid container spacing={{ xs: 1, md: 1 }}>
          {movies?.map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={movie._id} sx={{ 
              maxWidth: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%', xl: '25%' },
              flexBasis: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%', xl: '25%' }
            }}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.95 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }
                }}
                style={{ height: '100%' }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    maxWidth: 200, // Force maximum width
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: 'transparent',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    cursor: 'pointer',
                    margin: '0 auto', // Center the card
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      '& .movie-overlay': {
                        opacity: 1,
                      },
                      '& .movie-image': {
                        transform: 'scale(1.05)',
                      }
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                    {/* Movie Poster */}
                    <CardMedia
                      className="movie-image"
                      component="img"
                      height="60"
                      image={movie.image || movie.poster || `https://via.placeholder.com/120x180/667eea/ffffff?text=${encodeURIComponent(movie.title)}`}
                      alt={movie.title}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        borderRadius: 2
                      }}
                    />

                    {/* Overlay */}
                    <Box
                      className="movie-overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2
                      }}
                    >
                      <IconButton
                        component={Link}
                        to={`/movies/${movie._id}`}
                        sx={{
                          background: 'rgba(255,255,255,0.9)',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            background: 'white',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <PlayArrow sx={{ fontSize: 14, color: '#667eea' }} />
                      </IconButton>
                    </Box>

                    {/* Rating Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'rgba(0,0,0,0.7)',
                        borderRadius: 1,
                        px: 0.5,
                        py: 0.25,
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.25}>
                        <Star sx={{ fontSize: 8, color: '#ffd700' }} />
                        <Typography
                          variant="caption" 
                          sx={{ 
                            color: 'white', 
                            fontWeight: 600,
                            fontSize: '0.5rem'
                          }}
                        >
                          {movie.rating || '8.5'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>

                  {/* Card Content */}
                  <CardContent 
                    sx={{ 
                      p: 0.5,
                      paddingBottom: '4px !important'
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      component={Link}
                      to={`/movies/${movie._id}`}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.6rem',
                        color: 'text.primary',
                        textDecoration: 'none',
                        mb: 0.25,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      {movie.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.5rem',
                        mb: 0.25
                      }}
                    >
                      {Array.isArray(movie.genre) 
                        ? movie.genre.join(', ') 
                        : movie.genre || 'Action, Drama'
                      }
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.45rem'
                      }}
                    >
                      {movie.duration || '2h 30m'}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default MovieGrid;
