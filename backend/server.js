require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = require('./config/db');
connectDB();

// Routes
const authRoute = require('./routes/authRoute');
app.use('/api/auth', authRoute);

const contactRoute = require('./routes/contactRoute');
app.use('/api/contact', contactRoute);

const productRoute = require('./routes/productRoute');
app.use('/api/products', productRoute);

const reviewRoute = require('./routes/reviewRoute');
app.use('/api/reviews', reviewRoute);

const orderRoute = require('./routes/orderRoute');
app.use('/api/orders', orderRoute);

// Basic Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'ArtisanAbode API is running in backend' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
