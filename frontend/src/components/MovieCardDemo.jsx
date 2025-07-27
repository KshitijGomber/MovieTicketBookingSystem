import React, { useState } from 'react';
import { Box, Typography, Grid, Container, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MovieCard from './MovieCard';
import { mockShows } from '../api/shows';

const MovieCardDemo = () => {
  const [variant, setVariant] = useState('default');
  const [favorites, setFavorites] = useState(new Set());

  const handleVariantChange = (event, newVariant) => {
    if (newVariant !== null) {
      setVariant(newVariant);
    }
  };

  const handleFavoriteToggle = (movieId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(movieId)) {
        newFavorites.delete(movieId);
      } else {
        newFavorites.add(movieId);
      }
      return newFavorites;
    });
  };

  const getGridCols = () => {
    switch (variant) {
      case 'compact': return { xs: 6, sm: 4, md: 3, lg: 2.4 };
      case 'featured': return { xs: 12, sm: 6, md: 4, lg: 3 };
      default: return { xs: 12, sm: 6, md: 4, lg: 3 };
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Movie Card Components
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Choose a variant to see different card styles
        </Typography>
        
        {/* Variant Selector */}
        <ToggleButtonGroup
          value={variant}
          exclusive
          onChange={handleVariantChange}
          aria-label="card variant"
          sx={{ mb: 3 }}
        >
          <ToggleButton value="compact" aria-label="compact">
            Compact
          </ToggleButton>
          <ToggleButton value="default" aria-label="default">
            Default
          </ToggleButton>
          <ToggleButton value="featured" aria-label="featured">
            Featured
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Movie Grid */}
      <Grid container spacing={3}>
        {mockShows.slice(0, 8).map((movie) => (
          <Grid item {...getGridCols()} key={movie._id}>
            <MovieCard
              movie={movie}
              variant={variant}
              isFavorite={favorites.has(movie._id)}
              onFavoriteToggle={handleFavoriteToggle}
              showPrice={true}
            />
          </Grid>
        ))}
      </Grid>

      {/* Usage Instructions */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          How to Use MovieCard Component:
        </Typography>
        <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto', fontSize: '0.8rem' }}>
{`import MovieCard from './components/MovieCard';

// Basic usage
<MovieCard movie={movieData} />

// With favorites
<MovieCard 
  movie={movieData}
  isFavorite={favorites.has(movie._id)}
  onFavoriteToggle={handleFavoriteToggle}
/>

// Different variants
<MovieCard movie={movieData} variant="compact" />
<MovieCard movie={movieData} variant="default" />
<MovieCard movie={movieData} variant="featured" />

// Hide price
<MovieCard movie={movieData} showPrice={false} />`}
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          <strong>Props:</strong>
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>movie</code> - Movie object with _id, title, image, description, etc.</li>
          <li><code>variant</code> - 'compact', 'default', or 'featured' (optional)</li>
          <li><code>isFavorite</code> - Boolean to show if movie is favorited (optional)</li>
          <li><code>onFavoriteToggle</code> - Function called when favorite button is clicked (optional)</li>
          <li><code>showPrice</code> - Boolean to show/hide price and book button (optional)</li>
        </ul>
      </Box>
    </Container>
  );
};

export default MovieCardDemo;
