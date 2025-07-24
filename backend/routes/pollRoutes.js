const express = require('express')
const Router = express.Router()
const {postPoll , addOptionsToPoll} = require('../controllers/pollController')

Router.route('/').post(postPoll)
Router.route('/addOptions').put(addOptionsToPoll)

module.exports = Router 