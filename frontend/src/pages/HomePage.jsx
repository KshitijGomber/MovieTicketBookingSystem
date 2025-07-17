import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ShowList from '../components/ShowList';

const HomePage = () => {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Hero />
      <Features />
      
      {/* Now Showing Section */}
      <motion.section
        id="movies"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
        style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}
      >
        <ShowList />
      </motion.section>
    </Box>
  );
};

export default HomePage;
