import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  Paper,
  Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Movie, PlayArrow, ExpandMore } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const theme = useTheme();

  const handleNavClick = (targetId) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement && window.lenis) {
      window.lenis.scrollTo(targetElement);
    } else if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ y, opacity }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Modern Gradient Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }
        }}
      />

      {/* Subtle Floating Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: 100,
          height: 100,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          right: '12%',
          width: 60,
          height: 60,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.15)'
        }}
        animate={{
          y: [0, -40, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10 }}>
        <Grid 
          container 
          spacing={{ xs: 4, md: 8 }} 
          alignItems="center" 
          sx={{ 
            minHeight: '100vh',
            py: { xs: 8, md: 12 }
          }}
        >
          
          {/* Left Content - Text */}
          <Grid size={{ xs: 12, md: 6, lg: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Stack spacing={{ xs: 3, md: 4 }} alignItems={{ xs: 'center', md: 'flex-start' }}>
                {/* Main Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontWeight: 900,
                      fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                      color: 'white',
                      lineHeight: { xs: 1.2, md: 1.1 },
                      letterSpacing: '-0.025em',
                      textAlign: { xs: 'center', md: 'left' },
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    Book
                    <Box
                      component="span"
                      sx={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        display: 'inline-block',
                        mx: { xs: 1, md: 2 }
                      }}
                    >
                      Your
                    </Box>
                    Movie
                  </Typography>
                </motion.div>
                
                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.95)',
                      fontWeight: 300,
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.875rem', lg: '2.125rem' },
                      letterSpacing: '-0.015em',
                      textAlign: { xs: 'center', md: 'left' },
                      maxWidth: { xs: '100%', md: '90%' }
                    }}
                  >
                    Your Ultimate Cinema Experience
                  </Typography>
                </motion.div>
                
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.85)',
                      fontWeight: 400,
                      lineHeight: 1.6,
                      fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                      textAlign: { xs: 'center', md: 'left' },
                      maxWidth: { xs: '100%', md: '85%' }
                    }}
                  >
                    Discover the latest blockbusters, choose your perfect seats, 
                    and book tickets instantly. The cinema experience starts here.
                  </Typography>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={{ xs: 2, sm: 3 }}
                    alignItems="center"
                    sx={{ width: '100%' }}
                  >
                    <Button
                      component={RouterLink}
                      to="/movies"
                      variant="contained"
                      size="large"
                      startIcon={<Movie />}
                      sx={{
                        py: { xs: 2, md: 2.5 },
                        px: { xs: 4, md: 5 },
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        fontWeight: 700,
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.98)',
                        color: '#667eea',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        minWidth: { xs: '100%', sm: 220, md: 240 },
                        boxShadow: '0 12px 40px rgba(255,255,255,0.25)',
                        textTransform: 'none',
                        '&:hover': {
                          background: 'rgba(255,255,255,1)',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 60px rgba(255,255,255,0.35)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      🎬 Browse Movies
                    </Button>
                    
                    <Button
                      onClick={() => handleNavClick('features')}
                      variant="outlined"
                      size="large"
                      startIcon={<PlayArrow />}
                      sx={{
                        py: { xs: 2, md: 2.5 },
                        px: { xs: 4, md: 5 },
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        fontWeight: 600,
                        borderRadius: 4,
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(20px)',
                        minWidth: { xs: '100%', sm: 200, md: 220 },
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255,255,255,0.15)',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 30px rgba(255,255,255,0.2)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      ✨ Learn More
                    </Button>
                  </Stack>
                </motion.div>
              </Stack>
            </motion.div>
          </Grid>

          {/* Right Content - Visual Elements */}
          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Box sx={{ 
                position: 'relative', 
                height: { xs: 250, sm: 350, md: 450 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Main Feature Card */}
                <motion.div
                  style={{
                    position: 'relative',
                    zIndex: 3
                  }}
                  animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Paper
                    elevation={24}
                    sx={{
                      width: { xs: 180, sm: 220, md: 260 },
                      height: { xs: 180, sm: 220, md: 260 },
                      borderRadius: 6,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 30px 80px rgba(102, 126, 234, 0.4)',
                      overflow: 'hidden',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 70%)',
                      }
                    }}
                  >
                    <Movie sx={{ 
                      fontSize: { xs: 60, sm: 80, md: 100 }, 
                      color: 'white',
                      mb: 2
                    }} />
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        textAlign: 'center'
                      }}
                    >
                      Latest Movies
                    </Typography>
                  </Paper>
                </motion.div>

                {/* Background Decorative Elements */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    zIndex: 1
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 100, sm: 120, md: 140 },
                      height: { xs: 100, sm: 120, md: 140 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255,107,107,0.3) 0%, rgba(78,205,196,0.3) 100%)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  />
                </motion.div>

                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    zIndex: 1
                  }}
                  animate={{
                    rotate: [360, 0],
                    scale: [1, 0.9, 1]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 80, sm: 100, md: 120 },
                      height: { xs: 80, sm: 100, md: 120 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(168,230,207,0.3) 0%, rgba(136,216,163,0.3) 100%)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255,255,255,0.15)'
                    }}
                  />
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced Scroll Indicator */}
      <motion.div 
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}
          onClick={() => handleNavClick('features')}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: 1.2,
              textTransform: 'uppercase'
            }}
          >
            Explore
          </Typography>
          <Box
            sx={{
              width: 2,
              height: 40,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)',
              borderRadius: 1,
              position: 'relative'
            }}
          />
          <ExpandMore 
            sx={{ 
              fontSize: 32, 
              color: 'rgba(255,255,255,0.8)',
              '&:hover': { 
                color: 'white',
                transform: 'scale(1.1)' 
              },
              transition: 'all 0.2s ease'
            }} 
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
