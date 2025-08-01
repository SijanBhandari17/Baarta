const express = require('express')
const Router = express.Router()
const {postDiscussion , deleteDiscussion , getDiscussion} = require('../controllers/discussionController')

Router.route('/').post(postDiscussion)
Router.route('/').delete(deleteDiscussion)
Router.route('/').get(getDiscussion)

module.exports = Router