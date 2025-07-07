const mongoose = require('mongoose');
require('dotenv').config();

// Force logging
console.log('Script started');
console.log('Node version:', process.version);
console.log('Mongoose version:', require('mongoose/package.json').version);

const MONGODB_URI = process.env.MONGODB_URI;

console.log('MongoDB URI:', MONGODB_URI ? 'Present' : 'Missing');

async function checkImage() {
  console.log('Starting checkImage function');
  
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Successfully connected to MongoDB');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    const db = mongoose.connection.db;
    console.log('Database name:', db.databaseName);
    
    try {
      const collections = await db.listCollections().toArray();
      console.log('📂 Available collections:', collections.map(c => c.name));
      
      if (!collections.some(c => c.name === 'shows')) {
        console.log('❌ "shows" collection not found in database');
        return;
      }
      
      console.log('🔍 Searching for show...');
      const show = await db.collection('shows').findOne(
        { title: 'Everything Everywhere All at Once' }
      );
      
      if (show) {
        console.log('\n🎬 Found show:');
        console.log('Title:', show.title);
        console.log('Image URL:', show.image);
        console.log('ID:', show._id);
      } else {
        console.log('\n❌ No show found with title "Everything Everywhere All at Once"');
        
        // List all shows to debug
        const allShows = await db.collection('shows').find({}).toArray();
        console.log(`\n📋 Found ${allShows.length} shows in database:`);
        allShows.forEach((s, i) => {
          console.log(`\nShow ${i + 1}:`);
          console.log('Title:', s.title);
          console.log('Image:', s.image);
          console.log('ID:', s._id);
        });
      }
    } catch (dbError) {
      console.error('Database operation error:', dbError);
    }
  } catch (connectionError) {
    console.error('❌ MongoDB connection error:');
    console.error(connectionError.message);
    if (connectionError.name === 'MongoServerSelectionError') {
      console.error('This usually means the server is not reachable. Check your connection and credentials.');
    }
  } finally {
    if (mongoose.connection.readyState === 1) { // 1 = connected
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

// Add error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('Calling checkImage()');
checkImage().catch(err => {
  console.error('Uncaught error in checkImage:', err);
  process.exit(1);
});