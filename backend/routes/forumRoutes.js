const express = require('express')
const Router = express.Router()
const {createForum , getForum , deleteForum} = require('../controllers/forumController')

Router.route('/').post(createForum)
Router.route('/').get(getForum)
Router.route('/').delete(deleteForum)
module.exports = Router