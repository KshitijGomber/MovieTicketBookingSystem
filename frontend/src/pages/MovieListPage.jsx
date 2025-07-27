import React from 'react';
import { Container, Typography, Box, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { LocalMovies, Theaters, Star } from '@mui/icons-material';
import ShowList from '../components/ShowList';

const MovieListPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        pt: 12
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'fixed',
          top: '20%',
          right: '10%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '30%',
          left: '5%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 0
        }}
      />

      <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mb: 4,
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                }}
              >
                <LocalMovies sx={{ fontSize: '2.5rem', color: 'white' }} />
              </Box>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)'
                    : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em'
                }}
              >
                All Movies
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Typography 
                variant="h5"
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  mb: 6
                }}
              >
                Discover and book tickets for the latest blockbusters, indie films, and timeless classics playing in theaters near you.
              </Typography>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: { xs: 2, md: 4 },
                flexWrap: 'wrap',
                mb: 6
              }}>
                {[
                  { icon: <LocalMovies />, number: '1000+', label: 'Movies Available' },
                  { icon: <Theaters />, number: '500+', label: 'Theater Partners' },
                  { icon: <Star />, number: '4.8/5', label: 'Average Rating' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        background: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderRadius: 3,
                        p: 3,
                        textAlign: 'center',
                        minWidth: 180,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Box sx={{ 
                        color: theme.palette.primary.main, 
                        mb: 1,
                        '& svg': { fontSize: '1.5rem' }
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: theme.palette.text.primary,
                          mb: 1
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          fontWeight: 500
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* Movies List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <ShowList />
        </motion.div>
      </Container>
    </Box>
  );
};

export default MovieListPage;
