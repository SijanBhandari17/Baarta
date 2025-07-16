const express = require('express')
const Router = express.Router()
const {createForum} = require('../controllers/forumController')

Router.route('/').post(createForum)

module.exports = Router