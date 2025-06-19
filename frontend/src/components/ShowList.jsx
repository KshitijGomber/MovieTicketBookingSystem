import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  CardActions,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import LanguageIcon from '@mui/icons-material/Language';

const ShowList = () => {
  const { data: shows, isLoading, error } = useQuery({
    queryKey: ['shows'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/shows');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading shows...</Typography>
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
    <Grid container spacing={4}>
      {shows.map((show) => (
        <Grid item xs={12} sm={6} md={4} key={show._id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="300"
              image={show.image}
              alt={show.title}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {show.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                {show.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${show.duration} mins`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<LocalMoviesIcon />}
                  label={show.genre}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<LanguageIcon />}
                  label={show.language}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                ${show.price}
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                component={Link}
                to={`/show/${show._id}`}
                variant="contained"
                fullWidth
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ShowList; 