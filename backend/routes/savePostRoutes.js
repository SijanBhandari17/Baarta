const express = require('express')
const Router = express.Router()
const {savePost} = require('../controllers/savePostController')

Router.route('/').post(savePost)

module.exports = Router

