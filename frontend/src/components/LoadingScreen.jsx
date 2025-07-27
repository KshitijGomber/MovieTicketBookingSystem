import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalMovies } from '@mui/icons-material';

const LoadingScreen = ({ isVisible = true, message = "Loading...", onFinish, duration = 2000 }) => {
  const theme = useTheme();

  // Auto-hide loading screen after specified duration
  useEffect(() => {
    if (isVisible && onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onFinish, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              backdropFilter: 'blur(20px)'
            }}
          />

          {/* Background decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '15%',
              width: 300,
              height: 300,
              background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              zIndex: 1
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              left: '10%',
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(100px)',
              zIndex: 1
            }}
          />

          {/* Loading content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Animated logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mb: 3,
                  boxShadow: '0 10px 20px rgba(102, 126, 234, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Shine effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    transform: 'skewX(-20deg)'
                  }}
                />
                
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <LocalMovies sx={{ fontSize: '1.5rem', color: 'white', position: 'relative', zIndex: 1 }} />
                </motion.div>
              </Box>
            </motion.div>

            {/* App name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)'
                    : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em'
                }}
              >
                BookYourMovie
              </Typography>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                <CircularProgress
                  size={60}
                  thickness={3}
                  sx={{
                    color: 'transparent',
                    '& .MuiCircularProgress-circle': {
                      stroke: 'url(#gradient)',
                    }
                  }}
                />
                <CircularProgress
                  size={60}
                  thickness={3}
                  variant="determinate"
                  value={25}
                  sx={{
                    color: 'rgba(102, 126, 234, 0.2)',
                    position: 'absolute',
                    left: 0,
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    }
                  }}
                />
                
                {/* SVG gradient definition */}
                <svg width={0} height={0}>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
              </Box>
            </motion.div>

            {/* Loading message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  mb: 2
                }}
              >
                {message}
              </Typography>
            </motion.div>

            {/* Animated dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  />
                ))}
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
