require('dotenv').config();
const mongoose = require('mongoose');
const Show = require('../models/Show');

// Updated shows data
const updatedShows = [
  {
    _id: '68548601467ac59650bff6c2',
    title: 'Inception',
    description: 'A thief who enters the dreams of others to steal their secrets gets a chance to have his old life back as payment for a task considered impossible: inception.',
    image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    duration: 148,
    genre: 'Sci-Fi',
    language: 'English',
    price: 9.99,
    showTimes: ['10:00 AM', '2:00 PM', '6:00 PM', '9:00 PM'],
    availableSeats: 30,
    totalSeats: 30
  },
  {
    _id: '68548601467ac59650bff6c3',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    duration: 152,
    genre: 'Action',
    language: 'English',
    price: 9.99,
    showTimes: ['11:00 AM', '3:00 PM', '7:00 PM', '10:00 PM'],
    availableSeats: 30,
    totalSeats: 30
  },
  {
    _id: '68548601467ac59650bff6c4',
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    duration: 132,
    genre: 'Drama',
    language: 'Korean',
    price: 9.99,
    showTimes: ['12:00 PM', '4:00 PM', '8:00 PM'],
    availableSeats: 30,
    totalSeats: 30
  },
  {
    _id: '68548601467ac59650bff6c5',
    title: 'Everything Everywhere All at Once',
    description: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what matters to her by connecting with the lives she could have led in other universes.',
    image: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    duration: 139,
    genre: 'Action',
    language: 'English',
    price: 9.99,
    showTimes: ['1:00 PM', '5:00 PM', '9:00 PM'],
    availableSeats: 30,
    totalSeats: 30
  },
  {
    _id: '68548601467ac59650bff6c6',
    title: 'Dune',
    description: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
    image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    duration: 155,
    genre: 'Sci-Fi',
    language: 'English',
    price: 9.99,
    showTimes: ['2:00 PM', '6:00 PM', '10:00 PM'],
    availableSeats: 30,
    totalSeats: 30
  }
];

async function updateShows() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking');
    console.log('Connected to MongoDB');

    // Delete all existing shows
    await Show.deleteMany({});
    console.log('Deleted existing shows');

    // Insert updated shows
    const result = await Show.insertMany(updatedShows);
    console.log(`Successfully inserted ${result.length} shows`);

    // Verify the update
    const count = await Show.countDocuments();
    console.log(`Total shows in database: ${count}`);

    // List all shows
    const shows = await Show.find({});
    console.log('\nCurrent shows in database:');
    shows.forEach(show => {
      console.log(`- ${show.title} (ID: ${show._id})`);
    });

    await mongoose.disconnect();
    console.log('\nDatabase update complete!');
  } catch (error) {
    console.error('Error updating shows:', error);
    process.exit(1);
  }
}

updateShows();
