require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const ContactSubmission = require('../models/ContactSubmission');

const syncDatabaseIndexes = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/artisanabode';
    console.log('🔄 Connecting to MongoDB...', uri);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected.');

    console.log('⚙️  Syncing indexes... This may take a while depending on collection size.');
    
    await User.syncIndexes();
    console.log('✅ User indexes synced.');

    await Product.syncIndexes();
    console.log('✅ Product indexes synced.');

    await Order.syncIndexes();
    console.log('✅ Order indexes synced.');

    await Review.syncIndexes();
    console.log('✅ Review indexes synced.');

    await ContactSubmission.syncIndexes();
    console.log('✅ ContactSubmission indexes synced.');

    console.log('🎉 All indexes synchronized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error synchronizing indexes:', error);
    process.exit(1);
  }
};

syncDatabaseIndexes();
