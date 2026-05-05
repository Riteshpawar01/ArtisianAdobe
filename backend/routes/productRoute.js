const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);

module.exports = router;
