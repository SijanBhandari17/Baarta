const express = require('express')
const Router = express.Router()
const {savePost, deleteSavedPost, getSavedPost} = require('../controllers/savePostController')

Router.route('/').post(savePost)
Router.route('/').delete(deleteSavedPost)
Router.route('/').get(getSavedPost)

module.exports = Router

