const express = require('express');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', validateRegistration, authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, authController.login);

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, authController.getCurrentUser);

module.exports = router;