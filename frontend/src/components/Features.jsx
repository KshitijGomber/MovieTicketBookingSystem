import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Paper
} from '@mui/material';
import { 
  Movie, 
  EventSeat, 
  AccessTime, 
  Payment,
  Smartphone,
  Security
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

const Features = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Movie sx={{ fontSize: 50 }} />,
      title: 'Latest Movies',
      description: 'Discover the latest blockbusters and indie films from around the world with our curated selection.',
      color: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
      bgColor: 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,142,142,0.05))',
      delay: 0.1
    },
    {
      icon: <EventSeat sx={{ fontSize: 50 }} />,
      title: 'Smart Seat Selection',
      description: 'Choose your perfect seats with our interactive theater layout system and real-time availability.',
      color: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
      bgColor: 'linear-gradient(135deg, rgba(78,205,196,0.1), rgba(68,160,141,0.05))',
      delay: 0.2
    },
    {
      icon: <AccessTime sx={{ fontSize: 50 }} />,
      title: 'Flexible Showtimes',
      description: 'Book tickets for showtimes that fit your schedule across multiple theaters and locations.',
      color: 'linear-gradient(135deg, #a8e6cf, #88d8a3)',
      bgColor: 'linear-gradient(135deg, rgba(168,230,207,0.1), rgba(136,216,163,0.05))',
      delay: 0.3
    },
    {
      icon: <Payment sx={{ fontSize: 50 }} />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with multiple payment options for your convenience.',
      color: 'linear-gradient(135deg, #ffd93d, #ff6b6b)',
      bgColor: 'linear-gradient(135deg, rgba(255,217,61,0.1), rgba(255,107,107,0.05))',
      delay: 0.4
    },
    {
      icon: <Smartphone sx={{ fontSize: 50 }} />,
      title: 'Mobile Friendly',
      description: 'Access your tickets anywhere with our responsive design and mobile-optimized experience.',
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      bgColor: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.05))',
      delay: 0.5
    },
    {
      icon: <Security sx={{ fontSize: 50 }} />,
      title: 'Trusted Platform',
      description: 'Your data is safe with our enterprise-grade security and privacy protection measures.',
      color: 'linear-gradient(135deg, #f093fb, #f5576c)',
      bgColor: 'linear-gradient(135deg, rgba(240,147,251,0.1), rgba(245,87,108,0.05))',
      delay: 0.6
    }
  ];

  return (
    <Box 
      id="features"
      sx={{ 
        position: 'relative',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
          : 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        overflow: 'hidden',
        height: '100vh'
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 1
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          zIndex: 1
        }}
      />

      {/* Header Section */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pt: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 3,
              letterSpacing: '-0.02em'
            }}
          >
            Why Choose Us?
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontWeight: 300,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.125rem', md: '1.375rem' }
            }}
          >
            Experience the future of movie booking with our comprehensive platform
          </Typography>
        </Box>
      </Container>

      {/* Scroll Stack Section */}
      <Box sx={{ height: 'calc(100vh - 200px)', position: 'relative', zIndex: 2 }}>
        <ScrollStack
          itemDistance={120}
          itemScale={0.05}
          itemStackDistance={40}
          stackPosition="25%"
          scaleEndPosition="15%"
          baseScale={0.88}
          rotationAmount={2}
          blurAmount={1}
        >
          {features.map((feature, index) => (
            <ScrollStackItem key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  height: '100%',
                  borderRadius: 4,
                  background: feature.bgColor,
                  border: '1px solid rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(255,255,255,1)',
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                    '& .feature-bg': {
                      opacity: 0.8,
                      transform: 'scale(1.1)',
                    }
                  }
                }}
              >
                {/* Background Icon */}
                <Box
                  className="feature-bg"
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 120,
                    height: 120,
                    background: feature.color,
                    borderRadius: '50%',
                    opacity: 0.4,
                    filter: 'blur(30px)',
                    transition: 'all 0.4s ease',
                    transform: 'scale(1)',
                  }}
                />

                {/* Content */}
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  {/* Icon */}
                  <Box
                    className="feature-icon"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      background: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      '& svg': {
                        color: 'white',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      }
                    }}
                  >
                    {feature.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: 'text.primary',
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }}
                  >
                    {feature.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </Box>
    </Box>
  );
};

export default Features;
