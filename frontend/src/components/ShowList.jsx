import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import MovieGrid from './MovieGrid';
import { fetchShows } from '../api/shows';

const ShowList = () => {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['shows'],
    queryFn: fetchShows,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">Error loading shows: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <MovieGrid movies={movies || []} loading={isLoading} />
    </Container>
  );
};

export default ShowList; 