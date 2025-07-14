require('dotenv').config();
const mongoose = require('mongoose');
const Show = require('../models/Show');
const Theater = require('../models/Theater');

const mockShows = [
  {
    title: "Inception",
    description: "A thief who enters the dreams of others to steal their secrets gets a chance to have his old life back as payment for a task considered impossible: inception.",
    image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    duration: 148,
    genre: "Sci-Fi",
    language: "English",
    rating: "PG-13",
    price: 12.99
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    duration: 152,
    genre: "Action",
    language: "English",
    rating: "PG-13",
    price: 13.99
  },
  {
    title: "Parasite",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    duration: 132,
    genre: "Drama",
    language: "Korean",
    rating: "R",
    price: 11.99
  },
  {
    title: "Everything Everywhere All at Once",
    description: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    image: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    duration: 139,
    genre: "Action/Comedy",
    language: "English/Chinese",
    rating: "R",
    price: 14.99
  },
  {
    title: "Dune",
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
    image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    duration: 155,
    genre: "Sci-Fi",
    language: "English",
    rating: "PG-13",
    price: 15.99
  },
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    duration: 180,
    genre: "Biography/Drama",
    language: "English",
    rating: "R",
    price: 16.99
  },
  {
    title: "Spider-Man: No Way Home",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
    image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    duration: 148,
    genre: "Action/Adventure",
    language: "English",
    rating: "PG-13",
    price: 14.99
  },
  {
    title: "The Batman",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    image: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    duration: 176,
    genre: "Action/Crime",
    language: "English",
    rating: "PG-13",
    price: 13.99
  }
];

const showTimes = [
  "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", 
  "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", 
  "8:00 PM", "9:00 PM", "10:00 PM"
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing shows
    await Show.deleteMany({});
    console.log('Cleared existing shows');

    // Get all theaters
    const theaters = await Theater.find({});
    if (theaters.length === 0) {
      console.error('No theaters found! Please run seedTheaters.js first.');
      process.exit(1);
    }

    console.log(`Found ${theaters.length} theaters`);

    // Create shows with theater associations
    const showsWithTheaters = mockShows.map(show => {
      // Randomly assign 2-4 theaters per show
      const numberOfTheaters = Math.floor(Math.random() * 3) + 2; // 2-4 theaters
      const assignedTheaters = theaters
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, numberOfTheaters) // Take first N theaters
        .map(theater => ({
          theater: theater._id,
          showTimes: showTimes
            .sort(() => 0.5 - Math.random()) // Shuffle show times
            .slice(0, Math.floor(Math.random() * 4) + 3), // 3-6 show times per theater
          availableSeats: Math.floor(Math.random() * 50) + 80 // 80-130 seats
        }));

      return {
        ...show,
        theaters: assignedTheaters
      };
    });

    // Insert new shows
    const insertedShows = await Show.insertMany(showsWithTheaters);
    console.log(`Created ${insertedShows.length} shows with theater associations`);

    // Log some details
    for (const show of insertedShows) {
      console.log(`📽️  ${show.title}: ${show.theaters.length} theaters`);
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
