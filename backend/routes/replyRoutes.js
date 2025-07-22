const express = require('express')
const Router = express.Router()
const {addReplyToComment} = require('../controllers/repliesController')

Router.route('/').post(addReplyToComment)


module.exports = Router