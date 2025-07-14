require('dotenv').config();
const mongoose = require('mongoose');
const Theater = require('../models/Theater');
const Showtime = require('../models/ShowTime');
const Show = require('../models/Show');

const theaters = [
  {
    name: "INOX Megaplex: Phoenix Mall of the Millennium",
    location: {
      address: "Phoenix Mall of the Millennium, High Street Road",
      city: "Pune",
      state: "Maharashtra",
      zipCode: "411014",
      coordinates: {
        latitude: 18.5204,
        longitude: 73.8567
      }
    },
    seatingCapacity: 300,
    amenities: [
      "IMAX",
      "Dolby Atmos",
      "Recliner Seats",
      "Food Court",
      "Parking",
      "Wheelchair Accessible",
      "Air Conditioning",
      "Premium Lounge",
      "Concessions",
      "Online Booking",
      "Mobile Tickets"
    ],
    screens: [
      { screenNumber: 1, screenType: "IMAX", seatingCapacity: 100 },
      { screenNumber: 2, screenType: "Premium", seatingCapacity: 80 },
      { screenNumber: 3, screenType: "Standard", seatingCapacity: 120 }
    ],
    contactInfo: {
      phone: "+91-20-1234-5678",
      email: "phoenix@inoxmovies.com",
      website: "https://www.inoxmovies.com"
    },
    operatingHours: {
      monday: { open: "09:00", close: "23:00" },
      tuesday: { open: "09:00", close: "23:00" },
      wednesday: { open: "09:00", close: "23:00" },
      thursday: { open: "09:00", close: "23:00" },
      friday: { open: "09:00", close: "24:00" },
      saturday: { open: "09:00", close: "24:00" },
      sunday: { open: "09:00", close: "23:00" }
    },
    rating: 4.5,
    totalReviews: 1250,
    images: [
      "https://images.unsplash.com/photo-1489185078254-c3365d6e359f?w=800",
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800"
    ],
    priceRange: { min: 150, max: 500 }
  },
  {
    name: "City Pride: Kothrud",
    location: {
      address: "Kothrud Depot, Paud Road",
      city: "Pune",
      state: "Maharashtra",
      zipCode: "411038",
      coordinates: {
        latitude: 18.5074,
        longitude: 73.8077
      }
    },
    seatingCapacity: 250,
    amenities: [
      "Dolby Atmos",
      "Recliner Seats",
      "Food Court",
      "Parking",
      "Wheelchair Accessible",
      "Air Conditioning",
      "Concessions",
      "Online Booking",
      "Mobile Tickets"
    ],
    screens: [
      { screenNumber: 1, screenType: "Premium", seatingCapacity: 90 },
      { screenNumber: 2, screenType: "Standard", seatingCapacity: 80 },
      { screenNumber: 3, screenType: "Standard", seatingCapacity: 80 }
    ],
    contactInfo: {
      phone: "+91-20-2345-6789",
      email: "kothrud@citypride.in",
      website: "https://www.citypride.in"
    },
    operatingHours: {
      monday: { open: "10:00", close: "22:30" },
      tuesday: { open: "10:00", close: "22:30" },
      wednesday: { open: "10:00", close: "22:30" },
      thursday: { open: "10:00", close: "22:30" },
      friday: { open: "10:00", close: "23:30" },
      saturday: { open: "10:00", close: "23:30" },
      sunday: { open: "10:00", close: "22:30" }
    },
    rating: 4.2,
    totalReviews: 890,
    images: [
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800"
    ],
    priceRange: { min: 120, max: 350 }
  },
  {
    name: "PVR Cinemas: Seasons Mall",
    location: {
      address: "Seasons Mall, Magarpatta Road",
      city: "Pune",
      state: "Maharashtra",
      zipCode: "411013",
      coordinates: {
        latitude: 18.5196,
        longitude: 73.9350
      }
    },
    seatingCapacity: 400,
    amenities: [
      "4DX",
      "Dolby Atmos",
      "Recliner Seats",
      "Food Court",
      "Parking",
      "Wheelchair Accessible",
      "Air Conditioning",
      "Premium Lounge",
      "Concessions",
      "Online Booking",
      "Mobile Tickets"
    ],
    screens: [
      { screenNumber: 1, screenType: "4DX", seatingCapacity: 60 },
      { screenNumber: 2, screenType: "Premium", seatingCapacity: 100 },
      { screenNumber: 3, screenType: "Standard", seatingCapacity: 120 },
      { screenNumber: 4, screenType: "Standard", seatingCapacity: 120 }
    ],
    contactInfo: {
      phone: "+91-20-3456-7890",
      email: "seasons@pvrcinemas.com",
      website: "https://www.pvrcinemas.com"
    },
    operatingHours: {
      monday: { open: "09:30", close: "23:30" },
      tuesday: { open: "09:30", close: "23:30" },
      wednesday: { open: "09:30", close: "23:30" },
      thursday: { open: "09:30", close: "23:30" },
      friday: { open: "09:30", close: "24:00" },
      saturday: { open: "09:30", close: "24:00" },
      sunday: { open: "09:30", close: "23:30" }
    },
    rating: 4.7,
    totalReviews: 2100,
    images: [
      "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
    ],
    priceRange: { min: 180, max: 600 }
  }
];

const seedTheaters = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing theaters
    await Theater.deleteMany({});
    console.log('Cleared existing theaters');

    // Insert new theaters
    const createdTheaters = await Theater.insertMany(theaters);
    console.log(`Inserted ${createdTheaters.length} theaters`);

    // Get existing shows
    const shows = await Show.find({});
    console.log(`Found ${shows.length} shows`);

    if (shows.length > 0) {
      // Create showtimes for each theater and show
      const showtimes = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) { // Next 7 days
        const showDate = new Date(today);
        showDate.setDate(today.getDate() + i);
        
        for (const theater of createdTheaters) {
          for (const show of shows) {
            // Create multiple showtimes per day
            const times = ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM'];
            
            for (const time of times) {
              const screenIndex = Math.floor(Math.random() * theater.screens.length);
              const screen = theater.screens[screenIndex];
              
              showtimes.push({
                show: show._id,
                theater: theater._id,
                screen: {
                  screenNumber: screen.screenNumber,
                  screenType: screen.screenType
                },
                showDate: showDate,
                showTime: time,
                price: {
                  base: theater.priceRange.min + Math.floor(Math.random() * 50),
                  premium: theater.priceRange.min + 100,
                  vip: theater.priceRange.max
                },
                availableSeats: screen.seatingCapacity,
                totalSeats: screen.seatingCapacity,
                language: show.language || 'English',
                format: screen.screenType === 'IMAX' ? 'IMAX' : 
                        screen.screenType === '4DX' ? '4DX' : '2D',
                status: 'active'
              });
            }
          }
        }
      }
      
      // Clear existing showtimes
      await Showtime.deleteMany({});
      console.log('Cleared existing showtimes');
      
      // Insert new showtimes
      await Showtime.insertMany(showtimes);
      console.log(`Created ${showtimes.length} showtimes`);
    }

    console.log('Theater and showtime seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding theaters:', error);
    process.exit(1);
  }
};

seedTheaters();