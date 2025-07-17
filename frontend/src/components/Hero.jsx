import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Movie, PlayArrow, ExpandMore } from '@mui/icons-material';

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ y, opacity }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }
        }}
      />

      {/* Floating Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 100,
          height: 100,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          backdropFilter: 'blur(10px)',
        }}
        animate={{
          y: [0, 30, 0],
          rotate: [0, 180, 360],
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
          right: '15%',
          width: 60,
          height: 60,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          backdropFilter: 'blur(10px)',
        }}
        animate={{
          y: [0, -40, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: '100vh', py: 8 }}>
          
          {/* Left Side - Content */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '3rem', md: '4rem', lg: '5rem' },
                    color: 'white',
                    mb: 2,
                    lineHeight: 1.1
                  }}
                >
                  Book<span style={{ 
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>Your</span>Movie
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    mb: 2,
                    fontWeight: 300
                  }}
                >
                  Your Ultimate Movie Experience
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    mb: 4,
                    maxWidth: 600,
                    lineHeight: 1.6
                  }}
                >
                  Discover the latest blockbusters, choose your perfect seats, 
                  and book tickets instantly. The cinema experience starts here.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button
                    component={RouterLink}
                    to="/movies"
                    variant="contained"
                    size="large"
                    startIcon={<Movie />}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.95)',
                      color: '#667eea',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      minWidth: 200,
                      '&:hover': {
                        background: 'rgba(255,255,255,1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease'
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
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 3,
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(10px)',
                      minWidth: 200,
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ✨ Learn More
                  </Button>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Right Side - Floating Movie Cards */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 100, scale: 0.8 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Box sx={{ position: 'relative', height: 500 }}>
                {/* Floating Movie Card 1 */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 3
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Paper
                    elevation={10}
                    sx={{
                      width: 160,
                      height: 240,
                      borderRadius: 3,
                      overflow: 'hidden',
                      background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Movie sx={{ fontSize: 60, color: 'white' }} />
                  </Paper>
                </motion.div>

                {/* Floating Movie Card 2 */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 100,
                    left: 0,
                    zIndex: 2
                  }}
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, -3, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      width: 140,
                      height: 200,
                      borderRadius: 3,
                      overflow: 'hidden',
                      background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Movie sx={{ fontSize: 50, color: 'white' }} />
                  </Paper>
                </motion.div>

                {/* Floating Movie Card 3 */}
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 50,
                    zIndex: 1
                  }}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      width: 120,
                      height: 180,
                      borderRadius: 3,
                      overflow: 'hidden',
                      background: 'linear-gradient(45deg, #a8e6cf, #88d8a3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Movie sx={{ fontSize: 40, color: 'white' }} />
                  </Paper>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll Indicator */}
      <motion.div 
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ cursor: 'pointer' }}
          onClick={() => handleNavClick('features')}
        >
          <ExpandMore 
            sx={{ 
              fontSize: 40, 
              color: 'white',
              opacity: 0.8,
              '&:hover': { opacity: 1 }
            }} 
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
