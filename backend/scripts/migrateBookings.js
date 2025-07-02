const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('../models/Booking');
const { processPayment } = require('../utils/paymentService');

dotenv.config();

async function migrateBookings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find all existing bookings that don't have the new fields
    const bookings = await Booking.find({
      $or: [
        { bookingReference: { $exists: false } },
        { 'payment.id': { $exists: false } },
        { status: { $nin: ['pending_payment', 'booked', 'cancelled', 'completed'] } }
      ]
    });

    console.log(`Found ${bookings.length} bookings to migrate`);

    let updatedCount = 0;
    
    for (const booking of bookings) {
      try {
        const updates = {};
        let needsUpdate = false;

        // Add booking reference if missing
        if (!booking.bookingReference) {
          updates.bookingReference = `BK${booking._id.toString().slice(-8)}`;
          needsUpdate = true;
        }

        // Add payment details if missing
        if (!booking.payment || !booking.payment.id) {
          const paymentResult = await processPayment({
            amount: 0, // Default amount for migrated bookings
            description: `Migrated booking ${booking._id}`,
          });

          updates.payment = {
            id: paymentResult.paymentId,
            amount: 0,
            status: 'succeeded',
            method: 'migration',
            gateway: 'migration',
            receiptUrl: `https://example.com/receipts/migrated-${booking._id}`,
            createdAt: booking.createdAt || new Date()
          };
          needsUpdate = true;
        }

        // Update status to match the new enum if needed
        const validStatuses = ['pending_payment', 'booked', 'cancelled', 'completed'];
        if (!validStatuses.includes(booking.status)) {
          updates.status = booking.status === 'cancelled' ? 'cancelled' : 'booked';
          needsUpdate = true;
        }

        // Update the booking if needed
        if (needsUpdate) {
          await Booking.findByIdAndUpdate(booking._id, { $set: updates });
          updatedCount++;
          console.log(`Updated booking ${booking._id}`);
        }
      } catch (error) {
        console.error(`Error migrating booking ${booking._id}:`, error);
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} bookings.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

// Run the migration
migrateBookings();
