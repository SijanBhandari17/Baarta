const express = require('express')
const Router = express.Router()
const {postDiscussion , deleteDiscussion} = require('../controllers/discussionController')

Router.route('/').post(postDiscussion)
Router.route('/').delete(deleteDiscussion)

module.exports = Router