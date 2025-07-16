const express = require('express')
const Router = express.Router()
const {createForum , getForum} = require('../controllers/forumController')

Router.route('/').post(createForum)
Router.route('/').get(getForum)

module.exports = Router