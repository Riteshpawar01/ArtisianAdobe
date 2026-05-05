const Product = require('../models/Product');

// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Fetch Product Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, artisan } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images: images || [],
      artisan: artisan || { name: 'Unknown Artisan' }
    });

    await newProduct.save();

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
