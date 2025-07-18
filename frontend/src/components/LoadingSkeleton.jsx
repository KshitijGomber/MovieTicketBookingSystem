import React from 'react';
import { 
  Skeleton, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Container 
} from '@mui/material';

export const MovieCardSkeleton = ({ count = 8 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card>
            <Skeleton 
              variant="rectangular" 
              height={300} 
              animation="wave"
            />
            <CardContent>
              <Skeleton 
                variant="text" 
                height={32} 
                width="80%" 
                animation="wave"
              />
              <Skeleton 
                variant="text" 
                height={20} 
                width="60%" 
                animation="wave"
                sx={{ mt: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton 
                  variant="rounded" 
                  width={60} 
                  height={24} 
                  animation="wave"
                />
                <Skeleton 
                  variant="rounded" 
                  width={80} 
                  height={24} 
                  animation="wave"
                />
              </Box>
              <Skeleton 
                variant="rounded" 
                height={40} 
                width="100%" 
                animation="wave"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export const MovieDetailsSkeleton = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Skeleton variant="text" width={120} height={40} sx={{ mb: 3 }} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Skeleton 
            variant="rectangular" 
            height={600} 
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Skeleton variant="text" height={60} width="70%" sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton 
                key={i}
                variant="rounded" 
                width={80} 
                height={32} 
              />
            ))}
          </Box>
          
          <Skeleton variant="text" height={24} width="20%" sx={{ mb: 2 }} />
          <Skeleton variant="text" height={20} width="100%" />
          <Skeleton variant="text" height={20} width="90%" />
          <Skeleton variant="text" height={20} width="80%" />
          
          <Skeleton 
            variant="rectangular" 
            height={200} 
            sx={{ mt: 4, borderRadius: 2 }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export const BookingsSkeleton = ({ count = 6 }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" height={60} width="40%" sx={{ mb: 2 }} />
      <Skeleton variant="text" height={24} width="60%" sx={{ mb: 6 }} />
      
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Skeleton variant="text" height={28} width="60%" />
                  <Skeleton variant="rounded" width={80} height={24} />
                </Box>
                
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                    <Skeleton variant="text" height={20} width="70%" />
                  </Box>
                ))}
                
                <Skeleton 
                  variant="rounded" 
                  height={40} 
                  width="100%" 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export const SeatSelectionSkeleton = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="text" height={40} width="40%" sx={{ mb: 4, mx: 'auto' }} />
      
      {/* Screen */}
      <Skeleton 
        variant="rounded" 
        height={60} 
        width="60%" 
        sx={{ mb: 4, mx: 'auto' }}
      />
      
      {/* Seat rows */}
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ mb: 2 }}>
          <Skeleton variant="text" height={24} width={60} sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {Array.from({ length: 10 }).map((_, seatIndex) => (
              <Skeleton 
                key={seatIndex}
                variant="rounded" 
                width={40} 
                height={40} 
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};