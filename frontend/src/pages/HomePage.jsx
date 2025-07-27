import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Hero from '../components/Hero';
import ShowList from '../components/ShowList';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      overflow: 'hidden',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
      position: 'relative'
    }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Hero />
      </motion.div>
      
      {/* Movies Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box
          id="movies"
          sx={{
            py: { xs: 6, md: 8 },
            position: 'relative'
          }}
        >
          <Container maxWidth={false} sx={{ position: 'relative', maxWidth: '1400px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Simple Section Header */}
              <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 2,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Latest Movies
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 400,
                    maxWidth: 500,
                    mx: 'auto',
                    fontSize: { xs: '1rem', md: '1.1rem' }
                  }}
                >
                  Discover and book tickets for the newest releases
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
