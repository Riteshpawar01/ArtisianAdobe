const mongoose = require('mongoose');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  const connectWithRetry = async () => {
    try {
      const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/artisanabode';
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      });

      console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
      retries += 1;
      console.error(`❌ MongoDB Connection Error (Attempt ${retries}/${MAX_RETRIES}):`, error.message);
      
      if (retries < MAX_RETRIES) {
        console.log(`🔄 Retrying database connection in 5 seconds...`);
        setTimeout(connectWithRetry, 5000);
      } else {
        console.error('🚫 Max retries reached. Exiting application gracefully.');
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};

mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connection established.');
});

mongoose.connection.on('error', (err) => {
  console.error(`⚠️ Mongoose connection encountered an error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose connection dropped.');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑 Mongoose connection safely closed due to application termination (SIGINT).');
    process.exit(0);
  } catch (err) {
    console.error('Error closing Mongoose connection:', err);
    process.exit(1);
  }
});

module.exports = connectDB;
