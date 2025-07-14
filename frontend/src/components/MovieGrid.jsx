import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton
} from '@mui/material';
import { PlayArrow, Star, AccessTime } from '@mui/icons-material';

const MovieGrid = ({ movies, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading movies...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Recommended Movies
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          See All
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={movie._id}>
            <Card 
              sx={{ 
                height: '100%',
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  '& .movie-overlay': {
                    opacity: 1
                  },
                  '& .movie-poster': {
                    transform: 'scale(1.05)'
                  }
                }
              }}
              component={Link}
              to={`/shows/${movie._id}`}
              style={{ textDecoration: 'none' }}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  className="movie-poster"
                  component="img"
                  image={movie.image}
                  alt={movie.title}
                  sx={{
                    aspectRatio: '2/3',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
                
                {/* Rating Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'rgba(0,0,0,0.8)',
                    borderRadius: 2,
                    px: 1,
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Star sx={{ color: '#FFD700', fontSize: 16 }} />
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {movie.rating || '8.5'}/10
                  </Typography>
                </Box>

                {/* Genre Badge */}
                <Chip
                  label={movie.genre}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,255,255,0.9)',
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}
                />

                {/* Hover Overlay */}
                <Box
                  className="movie-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconButton
                    sx={{
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  >
                    <PlayArrow sx={{ fontSize: 32 }} />
                  </IconButton>
                </Box>
              </Box>

              <CardContent sx={{ p: 2 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    lineHeight: 1.2,
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {movie.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                  </Typography>
                </Box>

                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {movie.language} • {movie.genre}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MovieGrid;