const express = require('express')
const Router = express.Router()
const {getForumWithRequest} = require('../controllers/miscallenuousController')

Router.route('/withForumRequest').get(getForumWithRequest)

module.exports = Router 