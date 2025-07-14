import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ShowList from '../components/ShowList';

const MovieListPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          All Movies
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover and book tickets for the latest movies playing in theaters near you.
        </Typography>
      </Box>
      <ShowList />
    </Container>
  );
};

export default MovieListPage;
