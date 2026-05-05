const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getVendorOrders } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/vendor/:vendorId', getVendorOrders);

module.exports = router;
