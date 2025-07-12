const express = require('express')
const Router = express.Router()
const handleLogin = require('../controllers/profilePicController')
const profileRequest = require('../controllers/requestProfileController')
Router.route('/profilepic').post(handleLogin)
Router.route('/profilepic').get(profileRequest)
module.exports = Router