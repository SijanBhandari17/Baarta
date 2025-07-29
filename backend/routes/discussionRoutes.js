const express = require('express')
const Router = express.Router()
const {postDiscussion} = require('../controllers/discussionController')

Router.route('/').post(postDiscussion)

module.exports = Router