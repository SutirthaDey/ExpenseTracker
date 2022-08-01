const express = require('express');
const paymentController = require('../controllers/payment');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware.authenticator,paymentController.createOrders);
router.post('/verify', authMiddleware.authenticator, paymentController.verifyOrder);

module.exports = router;
