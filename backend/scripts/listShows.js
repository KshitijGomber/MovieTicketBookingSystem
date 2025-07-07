const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function listShows() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const Show = require('../models/Show');
    const shows = await Show.find({}).sort('title');

    console.log('📽️  Showing all movies:');
    console.log('='.repeat(80));
    
    shows.forEach((show, index) => {
      console.log(`\n🎬 ${index + 1}. ${show.title}`);
      console.log('─'.repeat(80));
      console.log(`📝 Description: ${show.description}`);
      console.log(`🆔 ID: ${show._id}`);
      console.log(`🖼️  Image: ${show.image}`);
      console.log(`⏱️  Duration: ${show.duration} minutes`);
      console.log(`🎭 Genre: ${show.genre}`);
      console.log(`🌐 Language: ${show.language}`);
      console.log(`💰 Price: $${show.price.toFixed(2)}`);
      console.log(`🎭 Show Times: ${show.showTimes.join(', ')}`);
      console.log(`💺 Available Seats: ${show.availableSeats} of ${show.totalSeats}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`Total movies: ${shows.length}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

listShows();