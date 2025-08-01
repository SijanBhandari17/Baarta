const express = require('express')
const Router = express.Router()
const {savePost, deleteSavedPost} = require('../controllers/savePostController')

Router.route('/').post(savePost)
Router.route('/').delete(deleteSavedPost)

module.exports = Router

