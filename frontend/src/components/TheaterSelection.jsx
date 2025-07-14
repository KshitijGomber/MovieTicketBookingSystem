import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Rating,
  Divider,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  LocationOn,
  Phone,
  AccessTime,
  LocalParking,
  Restaurant,
  Accessible,
  AcUnit,
  Star,
  ExpandMore,
  ExpandLess,
  CheckCircle
} from '@mui/icons-material';

const TheaterSelection = ({ theaters, selectedTheater, onTheaterSelect, onShowtimeSelect, selectedShowtime }) => {
  const [expandedTheater, setExpandedTheater] = useState(null);

  const handleTheaterExpand = (theaterId) => {
    setExpandedTheater(expandedTheater === theaterId ? null : theaterId);
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'Parking': <LocalParking />,
      'Food Court': <Restaurant />,
      'Wheelchair Accessible': <Accessible />,
      'Air Conditioning': <AcUnit />
    };
    return iconMap[amenity] || <CheckCircle />;
  };

  const formatPrice = (price) => {
    if (typeof price === 'object') {
      return `₹${price.base} - ₹${price.vip || price.premium || price.base + 100}`;
    }
    return `₹${price}`;
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Select Theater & Showtime
      </Typography>

      {theaters.map((theater) => (
        <Card 
          key={theater._id} 
          sx={{ 
            mb: 2,
            border: selectedTheater?._id === theater._id ? 2 : 1,
            borderColor: selectedTheater?._id === theater._id ? 'primary.main' : 'divider',
            transition: 'all 0.3s ease'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {theater.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {theater.fullAddress || `${theater.location.address}, ${theater.location.city}`}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ color: '#FFD700', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      {theater.rating}/5 ({theater.totalReviews} reviews)
                    </Typography>
                  </Box>
                  
                  {theater.priceRange && (
                    <Typography variant="body2" color="primary">
                      {formatPrice(theater.priceRange)}
                    </Typography>
                  )}
                </Box>

                {/* Amenities */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {theater.amenities?.slice(0, 4).map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                  {theater.amenities?.length > 4 && (
                    <Chip
                      label={`+${theater.amenities.length - 4} more`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>

              <IconButton
                onClick={() => handleTheaterExpand(theater._id)}
                sx={{ ml: 2 }}
              >
                {expandedTheater === theater._id ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            {/* Showtimes */}
            {theater.showtimes && theater.showtimes.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Available Showtimes:
                </Typography>
                <Grid container spacing={1}>
                  {theater.showtimes.map((showtime) => (
                    <Grid item key={showtime._id}>
                      <Button
                        variant={selectedShowtime?._id === showtime._id ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => {
                          onTheaterSelect(theater);
                          onShowtimeSelect(showtime);
                        }}
                        sx={{
                          minWidth: 80,
                          fontSize: '0.8rem',
                          textTransform: 'none'
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" display="block">
                            {showtime.showTime}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {showtime.availableSeats} seats
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Expanded Details */}
            <Collapse in={expandedTheater === theater._id}>
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Contact Information
                  </Typography>
                  <List dense>
                    {theater.contactInfo?.phone && (
                      <ListItem>
                        <ListItemIcon><Phone fontSize="small" /></ListItemIcon>
                        <ListItemText primary={theater.contactInfo.phone} />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemIcon><AccessTime fontSize="small" /></ListItemIcon>
                      <ListItemText 
                        primary="Operating Hours" 
                        secondary="9:00 AM - 11:00 PM (Daily)"
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Amenities
                  </Typography>
                  <List dense>
                    {theater.amenities?.slice(0, 6).map((amenity) => (
                      <ListItem key={amenity}>
                        <ListItemIcon>
                          {getAmenityIcon(amenity)}
                        </ListItemIcon>
                        <ListItemText primary={amenity} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default TheaterSelection;