import React, { useEffect, useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import LanguageIcon from '@mui/icons-material/Language';

const TOTAL_SEATS = 30;

const fetchBookedSeats = async (showId, showTime) => {
  const res = await fetch(`http://localhost:3000/api/bookings/show/${showId}/seats?showTime=${encodeURIComponent(showTime)}`);
  if (!res.ok) throw new Error('Failed to fetch booked seats');
  const data = await res.json();
  return data.bookedSeats.length;
};

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

  // State to store available seats per showtime for each show
  const [seatAvailability, setSeatAvailability] = useState({});
  const [loadingSeats, setLoadingSeats] = useState({});

  useEffect(() => {
    if (!shows) return;
    const fetchAll = async () => {
      const newAvailability = {};
      const newLoading = {};
      for (const show of shows) {
        newAvailability[show._id] = {};
        newLoading[show._id] = {};
        for (const showTime of show.showTimes) {
          newLoading[show._id][showTime] = true;
          try {
            const booked = await fetchBookedSeats(show._id, showTime);
            newAvailability[show._id][showTime] = TOTAL_SEATS - booked;
          } catch {
            newAvailability[show._id][showTime] = 'Err';
          }
          newLoading[show._id][showTime] = false;
        }
      }
      setSeatAvailability(newAvailability);
      setLoadingSeats(newLoading);
    };
    fetchAll();
  }, [shows]);

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
                  icon={<LocalMoviesIcon sx={{ fontSize: '1rem' }} />}
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
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Available Seats:
                </Typography>
                {show.showTimes.map((showTime) => (
                  <Box key={showTime} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {showTime}:
                    </Typography>
                    {loadingSeats[show._id]?.[showTime] ? (
                      <CircularProgress size={12} />
                    ) : (
                      <Typography variant="caption" color={seatAvailability[show._id]?.[showTime] === 0 ? 'error' : 'success.main'}>
                        {seatAvailability[show._id]?.[showTime] === 'Err' ? 'Err' : `${seatAvailability[show._id]?.[showTime]} seats`}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                component={Link}
                to={`/show/${show._id}`}
                variant="contained"
                fullWidth
                // Disable if all showtimes are fully booked
                disabled={show.showTimes.every(st => seatAvailability[show._id]?.[st] === 0)}
              >
                {show.showTimes.every(st => seatAvailability[show._id]?.[st] === 0) ? 'Fully Booked' : 'View Details'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ShowList; 