const express = require('express');
const expenseController = require('../controllers/expense');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/',authMiddleware.authenticator,expenseController.getExpense);

module.exports = router;
