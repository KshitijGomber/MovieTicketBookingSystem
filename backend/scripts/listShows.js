require('dotenv').config();
const mongoose = require('mongoose');
const Show = require('../models/Show');
const Theater = require('../models/Theater'); // Need this for populate to work

const listShows = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Fetching shows...');
    const shows = await Show.find({}).populate('theaters.theater');
    console.log(`Found ${shows.length} shows`);
    
    if (shows.length === 0) {
      console.log('No shows found in the database.');
      return;
    }

    console.log(`\n📽️  Found ${shows.length} shows:\n`);
    
    shows.forEach((show, index) => {
      console.log(`${index + 1}. 🎬 Title: ${show.title}`);
      console.log(`   📝 Description: ${show.description.substring(0, 100)}...`);
      console.log(`   🖼️  Image: ${show.image}`);
      console.log(`   ⏰ Duration: ${show.duration} minutes`);
      console.log(`   🎭 Genre: ${show.genre}`);
      console.log(`   🗣️  Language: ${show.language}`);
      console.log(`   💰 Base Price: $${show.price}`);
      console.log(`   🏢 Theaters: ${show.theaters.length}`);
      
      if (show.theaters.length > 0) {
        show.theaters.forEach((theaterInfo, i) => {
          const theater = theaterInfo.theater;
          console.log(`      ${i + 1}. ${theater.name} (${theater.location.city})`);
          console.log(`         Show Times: ${theaterInfo.showTimes.join(', ')}`);
          console.log(`         Available Seats: ${theaterInfo.availableSeats}`);
        });
      }
      
      console.log(`   📅 Created: ${show.createdAt}`);
      console.log(`   🔄 Updated: ${show.updatedAt}`);
      console.log('   ' + '─'.repeat(80));
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error listing shows:', error);
    process.exit(1);
  }
};

listShows();