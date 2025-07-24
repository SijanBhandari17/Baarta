const express = require('express')
const Router = express.Router()
const {postPoll , updatePoll , deletePollOption , deletePoll, votePollOption} = require('../controllers/pollController')

Router.route('/').post(postPoll)
Router.route('/').put(updatePoll)
Router.route('/deleteOption').delete(deletePollOption)
Router.route('/deletePoll').delete(deletePoll)
Router.route('/vote').post(votePollOption)

module.exports = Router 