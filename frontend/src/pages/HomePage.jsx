import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Movie as MovieIcon, Stars, LocalMovies } from '@mui/icons-material';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ShowList from '../components/ShowList';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Enhanced background gradient
  const backgroundGradient = theme.palette.mode === 'dark'
    ? 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f23 100%)'
    : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 50%, #e3f2fd 100%)';

  return (
    <Box sx={{ 
      overflow: 'hidden',
      background: backgroundGradient,
      position: 'relative'
    }}>
      {/* Floating background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        {/* Floating decorative circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              scale: 0,
              rotate: 0
            }}
            animate={{ 
              opacity: [0, 0.1, 0],
              scale: [0, 1, 0],
              rotate: 360,
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0]
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              delay: i * 2
            }}
            style={{
              position: 'absolute',
              top: `${10 + i * 15}%`,
              left: `${5 + i * 15}%`,
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(20px)'
            }}
          />
        ))}
      </Box>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
      </motion.div>
      
      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Features />
      </motion.div>
      
      {/* Now Showing Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Box
          id="movies"
          sx={{
            py: { xs: 8, md: 12 },
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(45,45,45,0.9) 100%)'
              : 'linear-gradient(135deg, rgba(248,249,250,0.9) 0%, rgba(233,236,239,0.9) 100%)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Enhanced background decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '-10%',
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              zIndex: 1
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              bottom: '10%',
              right: '-5%',
              width: 350,
              height: 350,
              background: 'radial-gradient(circle, rgba(118,75,162,0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(70px)',
              zIndex: 1
            }}
          />

          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.2 }}
            >
              {/* Enhanced Section Header */}
              <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 4,
                      py: 2,
                      mb: 4,
                      borderRadius: 6,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    <LocalMovies sx={{ fontSize: '2rem' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Now Showing
                    </Typography>
                  </Paper>
                </motion.div>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 3,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Latest Movies
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 400,
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.7,
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}
                >
                  Discover the most anticipated movies and book your tickets for an unforgettable cinematic experience
                </Typography>
              </Box>

              {/* Movies Grid */}
              <ShowList />
            </motion.div>
          </Container>
        </Box>
      </motion.div>
    </Box>
  );
};

export default HomePage;
