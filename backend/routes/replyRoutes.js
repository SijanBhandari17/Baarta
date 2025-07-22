const express = require('express')
const Router = express.Router()
const {addReplyToComment, removeReplyFromComment} = require('../controllers/repliesController')

Router.route('/').post(addReplyToComment)
Router.route('/').delete(removeReplyFromComment)


module.exports = Router