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
  Chip,
  Rating,
  IconButton,
  Paper,
  Stack
} from '@mui/material';
import { PlayArrow, Star, AccessTime, LocalMovies } from '@mui/icons-material';
import { MovieCardSkeleton } from './LoadingSkeleton';
import AnimatedCard from './AnimatedCard';

const MovieGrid = ({ movies, loading }) => {
  if (loading) {
    return (
      <MovieCardSkeleton count={8} />
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
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
          mb: 4 
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '1.75rem', md: '2.125rem' },
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
              delayChildren: 0.3
            }
          }
        }}
      >
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {movies?.map((movie, index) => (
            <Grid item xs={6} sm={4} md={3} lg={3} xl={3} key={movie._id}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 60, scale: 0.9 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut"
                    }
                  }
                }}
                style={{ height: '100%' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: 'transparent',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      '& .movie-overlay': {
                        opacity: 1,
                      },
                      '& .movie-image': {
                        transform: 'scale(1.05)',
                      },
                      '& .movie-content': {
                        transform: 'translateY(-2px)',
                      }
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                    {/* Movie Poster */}
                    <CardMedia
                      className="movie-image"
                      component="img"
                      height="240"
                      image={movie.image || movie.poster || `https://via.placeholder.com/240x360/667eea/ffffff?text=${encodeURIComponent(movie.title)}`}
                      alt={movie.title}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        borderRadius: 2
                      }}
                    />

                    {/* Simple overlay */}
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
                          width: 48,
                          height: 48,
                          '&:hover': {
                            background: 'white',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <PlayArrow sx={{ fontSize: 24, color: '#667eea' }} />
                      </IconButton>
                    </Box>

                    {/* Simple Rating Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(0,0,0,0.7)',
                        borderRadius: 1,
                        px: 1,
                        py: 0.25,
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.25}>
                        <Star sx={{ fontSize: 12, color: '#ffd700' }} />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'white', 
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        >
                          {movie.rating || '8.5'}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Duration Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.primary', 
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        >
                          {movie.duration || '2h 30m'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>

                  {/* Card Content */}
                  <CardContent 
                    className="movie-content"
                    sx={{ 
                      p: 3,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <Typography
                      variant="h6"
                      component={Link}
                      to={`/movies/${movie._id}`}
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: 'text.primary',
                        textDecoration: 'none',
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3,
                        '&:hover': {
                          color: 'primary.main',
                        },
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {movie.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                        fontSize: '0.875rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5
                      }}
                    >
                      {movie.description || 'An amazing cinematic experience awaits you with this incredible story.'}
                    </Typography>

                    {/* Genre Tags */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {(movie.genre || 'Action,Drama').split(',').slice(0, 2).map((genre, idx) => (
                        <Chip
                          key={idx}
                          label={genre.trim()}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
                            color: 'primary.main',
                            border: '1px solid rgba(102,126,234,0.2)',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            '&:hover': {
                              background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))',
                            }
                          }}
                        />
                      ))}
                    </Box>

                    {/* Book Now Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Box
                        component={Link}
                        to={`/movies/${movie._id}`}
                        sx={{
                          display: 'block',
                          width: '100%',
                          py: 1.5,
                          textAlign: 'center',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderRadius: 2,
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 8px 25px rgba(102,126,234,0.4)',
                          }
                        }}
                      >
                        Book Tickets
                      </Box>
                    </motion.div>
                  </CardContent>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default MovieGrid;
