const express = require('express')
const Router = express.Router()
const {addReplyToComment, removeReplyFromComment, getReplyFromComment} = require('../controllers/repliesController')

Router.route('/').post(addReplyToComment)
Router.route('/').delete(removeReplyFromComment)
Router.route('/').get(getReplyFromComment)

module.exports = Router