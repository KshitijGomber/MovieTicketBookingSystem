import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Rating,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  PlayArrow,
  AccessTime,
  Star,
  Favorite,
  FavoriteBorder,
  Language,
  CalendarToday,
  AttachMoney
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ 
  movie, 
  isFavorite = false, 
  onFavoriteToggle,
  showPrice = true,
  variant = 'default' // 'default', 'compact', 'featured'
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${movie._id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(movie._id);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      y: -8,
      transition: { duration: 0.2 }
    }
  };

  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  // Variant-specific styling
  const getCardHeight = () => {
    switch (variant) {
      case 'compact': return 320;
      case 'featured': return 480;
      default: return 400;
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'compact': return 200;
      case 'featured': return 300;
      default: return 250;
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card
        sx={{
          height: getCardHeight(),
          position: 'relative',
          cursor: 'pointer',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          },
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
        onClick={handleCardClick}
      >
        {/* Movie Poster */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <motion.div variants={imageVariants}>
            <CardMedia
              component="img"
              height={getImageHeight()}
              image={movie.image || '/placeholder-movie.jpg'}
              alt={movie.title}
              sx={{
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
          </motion.div>
          
          {/* Overlay Gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.7) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              '.MuiCard-root:hover &': {
                opacity: 1
              }
            }}
          />

          {/* Rating Badge */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Star sx={{ fontSize: '1rem', color: '#ffd700' }} />
            <Typography variant="caption" color="white" fontWeight="bold">
              {movie.rating || '8.5'}
            </Typography>
          </Box>

          {/* Favorite Button */}
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? (
              <Favorite sx={{ color: '#e91e63', fontSize: '1.2rem' }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: '1.2rem' }} />
            )}
          </IconButton>

          {/* Play Button Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              '.MuiCard-root:hover &': {
                opacity: 1
              }
            }}
          >
            <IconButton
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                width: 56,
                height: 56,
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <PlayArrow sx={{ fontSize: '2rem', color: 'primary.main' }} />
            </IconButton>
          </Box>

          {/* Duration Badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <AccessTime sx={{ fontSize: '0.9rem', color: 'white' }} />
            <Typography variant="caption" color="white">
              {movie.duration}min
            </Typography>
          </Box>
        </Box>

        {/* Movie Details */}
        <CardContent sx={{ p: 2, height: 'calc(100% - 250px)', display: 'flex', flexDirection: 'column' }}>
          {/* Title */}
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              fontWeight: 'bold',
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              minHeight: '2.4em'
            }}
          >
            {movie.title}
          </Typography>

          {/* Genre and Language Chips */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={movie.genre} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 24 }}
            />
            <Chip 
              label={movie.language} 
              size="small" 
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 24 }}
            />
          </Box>

          {/* Description */}
          {variant !== 'compact' && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
                flex: 1
              }}
            >
              {movie.description}
            </Typography>
          )}

          {/* Bottom Section */}
          <Box sx={{ mt: 'auto' }}>
            {/* Price and Book Button */}
            {showPrice && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AttachMoney sx={{ fontSize: '1rem', color: 'success.main' }} />
                  <Typography variant="subtitle2" color="success.main" fontWeight="bold">
                    From ${movie.price}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  size="small"
                  startIcon={<PlayArrow />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 2
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                >
                  Book Now
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MovieCard;
