const express = require('express')
const Router = express.Router()
const {postPoll , updatePoll , deletePollOption , deletePoll, votePollOption, getPollsByForumId} = require('../controllers/pollController')

Router.route('/').post(postPoll)
Router.route('/').put(updatePoll)
Router.route('/deleteOption').delete(deletePollOption)
Router.route('/deletePoll').delete(deletePoll)
Router.route('/vote').post(votePollOption)
Router.route('/').get(getPollsByForumId)

module.exports = Router 