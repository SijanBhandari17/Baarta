//// password validation , email conflict , authorization are checked and done in authController.js . 
///////  basic password length , username validation should be done by frontend , not giving much load to backend for minor twicks/////

const express = require('express');
const router = express.Router();
const handleLogin = require('../controllers/authController');

router.post('/' , handleLogin);

module.exports = router;