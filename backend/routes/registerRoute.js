const express = require('express');
const router = express.Router();
const handleNewUser = require('../controllers/registerController');
const otpVerify = require('../controllers/otpController')
router.route('/').post(handleNewUser);
router.route('/otp').post(otpVerify)
module.exports = router;