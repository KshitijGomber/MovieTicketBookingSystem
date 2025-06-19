require('dotenv').config();
const mongoose = require('mongoose');
const Show = require('../models/Show');

const mockShows = [
  {
    title: "Inception",
    description: "A thief who enters the dreams of others to steal their secrets gets a chance to have his old life back as payment for a task considered impossible: inception.",
    image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    duration: 148,
    genre: "Sci-Fi",
    language: "English",
    price: 12.99,
    showTimes: ["10:00 AM", "2:00 PM", "6:00 PM", "9:00 PM"],
    availableSeats: 100
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    duration: 152,
    genre: "Action",
    language: "English",
    price: 13.99,
    showTimes: ["11:00 AM", "3:00 PM", "7:00 PM", "10:00 PM"],
    availableSeats: 100
  },
  {
    title: "Parasite",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    duration: 132,
    genre: "Drama",
    language: "Korean",
    price: 11.99,
    showTimes: ["1:00 PM", "4:00 PM", "8:00 PM"],
    availableSeats: 100
  },
  {
    title: "Everything Everywhere All at Once",
    description: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    image: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    duration: 139,
    genre: "Action/Comedy",
    language: "English/Chinese",
    price: 14.99,
    showTimes: ["12:00 PM", "3:30 PM", "7:30 PM", "10:30 PM"],
    availableSeats: 100
  },
  {
    title: "Dune",
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
    image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    duration: 155,
    genre: "Sci-Fi",
    language: "English",
    price: 15.99,
    showTimes: ["11:30 AM", "2:30 PM", "6:30 PM", "9:30 PM"],
    availableSeats: 100
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing shows
    await Show.deleteMany({});
    console.log('Cleared existing shows');

    // Insert new shows
    await Show.insertMany(mockShows);
    console.log('Inserted new shows');

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 