import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  useTheme,
  alpha
} from '@mui/material';
import { 
  PlayArrow, 
  Movie as MovieIcon,
  LocalMovies,
  Star
} from '@mui/icons-material';

const Hero = () => {
  const theme = useTheme();

  const scrollToMovies = () => {
    const moviesSection = document.getElementById('movies');
    if (moviesSection) {
      moviesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />

      {/* Floating movie icons */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            scale: 0,
            rotate: 0
          }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            rotate: 360,
            x: [0, 150, -100, 0],
            y: [0, -150, 100, 0]
          }}
          transition={{
            duration: 25 + i * 3,
            repeat: Infinity,
            delay: i * 3
          }}
          style={{
            position: 'absolute',
            top: `${20 + i * 10}%`,
            left: `${10 + i * 10}%`,
            color: 'rgba(255,255,255,0.2)',
            fontSize: '2rem',
            zIndex: 1
          }}
        >
          {i % 3 === 0 ? <MovieIcon /> : i % 3 === 1 ? <LocalMovies /> : <Star />}
        </motion.div>
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 120,
                height: 120,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                mb: 4,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <MovieIcon sx={{ fontSize: '4rem', color: 'white' }} />
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '3rem', md: '4rem', lg: '5rem' },
                mb: 2,
                background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                letterSpacing: '-0.02em'
              }}
            >
              BookYourMovie
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4,
                fontWeight: 400,
                fontSize: { xs: '1.5rem', md: '2rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.4
              }}
            >
              Your Gateway to Cinematic Adventures
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 6,
                fontWeight: 300,
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Discover the latest blockbusters, book your perfect seats, and create unforgettable movie memories with friends and family.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={scrollToMovies}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.3rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.25)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Explore Movies
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          >
            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', gap: { xs: 4, md: 8 } }}>
              {[
                { number: '1000+', label: 'Movies' },
                { number: '500+', label: 'Theaters' },
                { number: '1M+', label: 'Happy Customers' }
              ].map((stat, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.5rem', md: '2.5rem' },
                      mb: 1,
                      color: 'white'
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
