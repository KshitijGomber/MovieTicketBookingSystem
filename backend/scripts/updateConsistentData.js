require('dotenv').config();
const mongoose = require('mongoose');
const Show = require('../models/Show');
const Theater = require('../models/Theater');

async function updateConsistentData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all shows and update them with consistent data
    const shows = await Show.find({});
    console.log(`Found ${shows.length} shows to update`);

    for (let show of shows) {
      // Update basic show data
      show.price = 9.99;
      
      // Update each theater entry with consistent data
      if (show.theaters && show.theaters.length > 0) {
        for (let theaterEntry of show.theaters) {
          // Set 30 seats per showtime * number of showtimes as total available
          const totalSeatsForTheater = theaterEntry.showTimes ? theaterEntry.showTimes.length * 30 : 30;
          theaterEntry.availableSeats = totalSeatsForTheater;
          theaterEntry.totalSeats = totalSeatsForTheater;
        }
      }

      await show.save();
      console.log(`Updated show: ${show.title}`);
    }

    // Verify the updates
    const updatedShows = await Show.find({}).populate('theaters.theater');
    console.log('\n=== Updated Show Data ===');
    for (let show of updatedShows) {
      console.log(`\n${show.title} (Price: $${show.price})`);
      if (show.theaters && show.theaters.length > 0) {
        for (let theaterEntry of show.theaters) {
          const theaterName = theaterEntry.theater ? theaterEntry.theater.name : 'Unknown Theater';
          console.log(`  Theater: ${theaterName}`);
          console.log(`    Available Seats: ${theaterEntry.availableSeats} (30 per showtime)`);
          if (theaterEntry.showTimes && theaterEntry.showTimes.length > 0) {
            console.log(`    Show Times: ${theaterEntry.showTimes.join(', ')}`);
          }
        }
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Data consistency update complete!');
  } catch (error) {
    console.error('❌ Error updating data:', error);
    process.exit(1);
  }
}

updateConsistentData();
