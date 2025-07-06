require('dotenv').config();
const mongoose = require('mongoose');
const Show = require('../models/Show');

async function listShows() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking');
    console.log('Connected to MongoDB');
    
    const shows = await Show.find({});
    console.log('Found shows:', shows.length);
    shows.forEach(show => {
      console.log(`ID: ${show._id}, Title: ${show.title}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listShows();
