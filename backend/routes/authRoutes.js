const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validation');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    check('username', 'Username must be at least 3 characters').isLength({ min: 3 }),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  validate,
  register
);

// Login route
router.post(
  '/login',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
  ],
  validate,
  login
);

module.exports = router;
