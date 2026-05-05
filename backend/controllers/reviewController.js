const Review = require('../models/Review');
const Product = require('../models/Product');

// @route   GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('Fetch Reviews Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @route   POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment, userName } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, rating, and comment are required' });
    }

    const review = await Review.create({
      product: productId,
      rating,
      comment,
      userName: userName || 'Anonymous',
      status: 'approved' // Auto-approve for demo purposes
    });

    // Optionally update product average rating here
    
    res.status(201).json({ success: true, data: review, message: 'Review added successfully' });
  } catch (error) {
    console.error('Add Review Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
