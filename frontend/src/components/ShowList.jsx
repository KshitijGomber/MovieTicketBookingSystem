import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import MovieGrid from './MovieGrid';
import { fetchShows } from '../api/shows';
import { MovieCardSkeleton } from './LoadingSkeleton';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6, 2),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 50%, rgba(240, 147, 251, 0.1) 100%)',
    borderRadius: '20px',
    zIndex: -1,
  }
}));

const LoadingWrapper = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  borderRadius: '20px',
  margin: '2rem 0',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
  color: 'white',
}));

const ErrorWrapper = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
  borderRadius: '20px',
  color: 'white',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
}));

const ShowList = () => {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['shows'],
    queryFn: fetchShows,
  });

  if (isLoading) {
    return (
      <StyledContainer maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              🎬 Now Showing
            </Typography>
          </Box>
          <MovieCardSkeleton count={8} />
        </motion.div>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <ErrorWrapper
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          ⚠️ Error loading shows: {error.message}
        </Typography>
      </ErrorWrapper>
    );
  }

  return (
    <StyledContainer maxWidth="xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              🎬 Now Showing
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Discover the latest blockbusters and indie gems. Your next favorite movie is just a click away!
            </Typography>
          </motion.div>
        </Box>

        <MovieGrid movies={movies || []} loading={isLoading} />
      </motion.div>
    </StyledContainer>
  );
};

export default ShowList; 