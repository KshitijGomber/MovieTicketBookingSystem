import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Rating,
  Avatar,
  Divider,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Paper
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Star,
  Phone,
  ExpandMore,
  ExpandLess,
  LocalParking,
  Restaurant,
  Wifi,
  AcUnit,
  Accessible,
  LocalAtm,
  Security,
  EventSeat,
  CheckCircle
} from '@mui/icons-material';

const TheaterSelection = ({ 
  theaters, 
  selectedTheater, 
  onTheaterSelect, 
  selectedShowtime, 
  onShowtimeSelect 
}) => {
  const [expandedTheater, setExpandedTheater] = useState(null);

  const handleTheaterExpand = (theaterId) => {
    setExpandedTheater(expandedTheater === theaterId ? null : theaterId);
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'Parking': <LocalParking />,
      'Food Court': <Restaurant />,
      'WiFi': <Wifi />,
      'AC': <AcUnit />,
      'Air Conditioning': <AcUnit />,
      'Wheelchair Accessible': <Accessible />,
      'ATM': <LocalAtm />,
      'Security': <Security />,
    };
    return iconMap[amenity] || <Star />;
  };

  if (!theaters || theaters.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          No theaters available for this movie
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {theaters.map((theater) => (
          <Grid item xs={12} key={theater._id}>
            <Card 
              elevation={selectedTheater?._id === theater._id ? 8 : 2}
              sx={{ 
                borderRadius: 3,
                border: selectedTheater?._id === theater._id ? 2 : 0,
                borderColor: 'primary.main',
                transition: 'all 0.3s ease',
                '&:hover': {
                  elevation: 6,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Theater Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Avatar
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: 'primary.main',
                      mr: 2,
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {theater.name.charAt(0)}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
                        {theater.name}
                      </Typography>
                      {selectedTheater?._id === theater._id && (
                        <CheckCircle color="primary" sx={{ ml: 1 }} />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {theater.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Rating
                        value={theater.rating || 4.5}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="caption" color="text.secondary">
                        {theater.rating || 4.5} • {theater.reviews || 120} reviews
                      </Typography>
                    </Box>
                  </Box>

                  <IconButton
                    onClick={() => handleTheaterExpand(theater._id)}
                    sx={{ 
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    {expandedTheater === theater._id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>

                {/* Quick Info */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {theater.amenities?.slice(0, 3).map((amenity) => (
                    <Chip
                      key={amenity}
                      icon={getAmenityIcon(amenity)}
                      label={amenity}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiChip-icon': { fontSize: '1rem' }
                      }}
                    />
                  ))}
                  {theater.amenities?.length > 3 && (
                    <Chip
                      label={`+${theater.amenities.length - 3} more`}
                      size="small"
                      variant="filled"
                      color="primary"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                </Box>

                {/* Showtimes */}
                {theater.showtimes && theater.showtimes.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Available Showtimes
                    </Typography>
                    <Grid container spacing={1.5}>
                      {theater.showtimes.map((showtime) => (
                        <Grid item key={showtime._id}>
                          <Paper
                            elevation={selectedShowtime?._id === showtime._id ? 4 : 1}
                            sx={{
                              p: 2,
                              minWidth: 100,
                              textAlign: 'center',
                              cursor: 'pointer',
                              borderRadius: 2,
                              border: selectedShowtime?._id === showtime._id ? 2 : 1,
                              borderColor: selectedShowtime?._id === showtime._id ? 'primary.main' : 'divider',
                              bgcolor: selectedShowtime?._id === showtime._id ? 'primary.50' : 'background.paper',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: 'primary.50',
                                transform: 'translateY(-1px)',
                                boxShadow: 3
                              }
                            }}
                            onClick={() => {
                              onTheaterSelect(theater);
                              onShowtimeSelect(showtime);
                            }}
                          >
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: selectedShowtime?._id === showtime._id ? 'primary.main' : 'text.primary'
                              }}
                            >
                              {showtime.showTime}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                              <EventSeat sx={{ fontSize: '0.9rem', mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {showtime.availableSeats}
                              </Typography>
                            </Box>
                            {showtime.price && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  color: 'success.main',
                                  display: 'block',
                                  mt: 0.5
                                }}
                              >
                                ${showtime.price}
                              </Typography>
                            )}
                          </Paper>
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Contact Information
                      </Typography>
                      <List dense sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                        {theater.contactInfo?.phone && (
                          <ListItem>
                            <ListItemIcon><Phone fontSize="small" color="primary" /></ListItemIcon>
                            <ListItemText 
                              primary={theater.contactInfo.phone}
                              secondary="Phone Number"
                            />
                          </ListItem>
                        )}
                        <ListItem>
                          <ListItemIcon><AccessTime fontSize="small" color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="9:00 AM - 11:00 PM"
                            secondary="Operating Hours (Daily)"
                          />
                        </ListItem>
                      </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        All Amenities
                      </Typography>
                      <Grid container spacing={1}>
                        {theater.amenities?.map((amenity) => (
                          <Grid item xs={6} key={amenity}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              p: 1,
                              bgcolor: 'background.paper',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}>
                              {getAmenityIcon(amenity)}
                              <Typography variant="caption" sx={{ ml: 1 }}>
                                {amenity}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TheaterSelection;
