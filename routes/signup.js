const express = require('express');
const signupController = require('../controllers/signup');

const router = express.Router();

router.post('/signup', signupController.postSignUp);
router.post('/login', signupController.postLogIn)

module.exports = router;
