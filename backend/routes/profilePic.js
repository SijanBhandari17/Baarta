const express = require('express')
const Router = express.Router()
const handleLogin = require('../controllers/profilePicController')
Router.route('/profilepic').post(handleLogin)
module.exports = Router