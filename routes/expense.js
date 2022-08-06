const express = require('express');
const expenseController = require('../controllers/expense');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/expense',authMiddleware.authenticator,expenseController.getExpense);
router.post('/expense/addExpense', authMiddleware.authenticator, expenseController.postExpense);

module.exports = router;
