import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ShowList from '../components/ShowList';

const HomePage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      overflow: 'hidden',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
    }}>
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Now Showing Section */}
      <Box
        id="movies"
        sx={{
          py: { xs: 6, md: 10 },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '-10%',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(102,126,234,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 1
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '-5%',
            width: 250,
            height: 250,
            background: 'radial-gradient(circle, rgba(118,75,162,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
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
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 2,
                  letterSpacing: '-0.02em'
                }}
              >
                Now Showing
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 400,
                  maxWidth: 500,
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Discover the latest movies and book your perfect showtime
              </Typography>
            </Box>

            {/* Movies Grid */}
            <ShowList />
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
