const express = require('express')
const Router = express.Router()
const {addReplyToComment, removeReplyFromComment, getReplyFromComment, updateReplyFromComment} = require('../controllers/repliesController')

Router.route('/').post(addReplyToComment)
Router.route('/').delete(removeReplyFromComment)
Router.route('/').get(getReplyFromComment)
Router.route('/').put(updateReplyFromComment)

module.exports = Router