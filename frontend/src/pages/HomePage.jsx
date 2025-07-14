import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Movie, LocalMovies, TheaterComedy, AccessTime } from '@mui/icons-material';
import ShowList from '../components/ShowList';

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                BookYourMovie
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                Your Ultimate Movie Booking Experience
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                Discover the latest movies, choose your favorite theater, 
                select the perfect seats, and book your tickets in just a few clicks!
              </Typography>
              <Button
                component={RouterLink}
                to="/movies"
                variant="contained"
                size="large"
                startIcon={<Movie />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                Browse Movies
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <LocalMovies sx={{ fontSize: 200, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          Why Choose BookYourMovie?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <TheaterComedy sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Multiple Theaters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose from a wide selection of theaters across the city with 
                  different amenities and experiences.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <AccessTime sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Flexible Showtimes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Multiple showtimes throughout the day to fit your schedule perfectly.
                  Book for today or plan ahead!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Movie sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Easy Booking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Simple and intuitive booking process with real-time seat selection 
                  and instant confirmation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Now Showing Section */}
      <Container maxWidth="xl">
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Now Showing
        </Typography>
        <ShowList />
      </Container>
    </Box>
  );
};

export default HomePage;
