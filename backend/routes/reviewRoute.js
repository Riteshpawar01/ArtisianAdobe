const express = require('express');
const router = express.Router();
const { getProductReviews, addReview } = require('../controllers/reviewController');

router.get('/product/:productId', getProductReviews);
router.post('/', addReview);

module.exports = router;
