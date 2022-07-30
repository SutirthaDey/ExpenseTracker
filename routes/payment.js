const express = require('express');
const paymentController = require('../controllers/payment');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/', paymentController.createOrder);

module.exports = router;
