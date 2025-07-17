import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { Movie } from '@mui/icons-material';

const LoadingScreen = ({ isVisible, onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(onFinish, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(timer);
    }
  }, [isVisible, onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Movie sx={{ fontSize: 80, mb: 3 }} />
              </motion.div>
              
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                BookYourMovie
              </Typography>
              
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                Your Ultimate Movie Experience Awaits
              </Typography>
              
              {/* Progress Bar */}
              <Box sx={{ width: 300, mx: 'auto', mb: 2 }}>
                <Box sx={{ 
                  width: '100%', 
                  height: 6, 
                  backgroundColor: 'rgba(255,255,255,0.3)', 
                  borderRadius: 3,
                  overflow: 'hidden'
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
                      borderRadius: 3,
                      width: `${progress}%`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                  Loading... {progress}%
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
