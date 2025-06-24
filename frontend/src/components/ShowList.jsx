import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';

const TOTAL_SEATS = 30;
const API_URL = import.meta.env.VITE_API_URL;

const fetchBookedSeats = async (showId, showTime) => {
  // const res = await fetch(`http://localhost:3000/api/bookings/show/${showId}/seats?showTime=${encodeURIComponent(showTime)}`);
  const res = await fetch(`${API_URL}/bookings/show/${showId}/seats?showTime=${encodeURIComponent(showTime)}`);
  if (!res.ok) throw new Error('Failed to fetch booked seats');
  const data = await res.json();
  return data.bookedSeats.length;
};

const ShowList = () => {
  const { data: shows, isLoading, error } = useQuery({
    queryKey: ['shows'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/shows`);
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

  const isShowFullyBooked = (show) => {
    if (!seatAvailability[show._id]) {
      return false; // Or a default state until data is loaded
    }
    return show.showTimes.every(st => seatAvailability[show._id]?.[st] === 0);
  };

  return (
    <Grid container spacing={3}>
      {shows.map((show) => {
        const fullyBooked = isShowFullyBooked(show);
        return (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={show._id}>
            <Link 
              to={`/show/${show._id}`} 
              style={{ 
                textDecoration: 'none',
                pointerEvents: fullyBooked ? 'none' : 'auto'
              }}
            >
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                }
              }}>
                {fullyBooked && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                    borderRadius: 1,
                  }}>
                    <Typography variant="h6">Fully Booked</Typography>
                  </Box>
                )}
                <CardMedia
                  component="img"
                  image={show.image}
                  alt={show.title}
                  sx={{
                    aspectRatio: '2/3',
                    objectFit: 'cover',
                    width: '100%'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {show.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {show.genre}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        )
      })}
    </Grid>
  );
};

export default ShowList; 