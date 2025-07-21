const express = require('express')
const Router = express.Router()
const {uploadPost , getPost} = require('../controllers/postController')
const postPicMiddleware = require('../middleware/cloudinaryMiddleware')
Router.route('/').post(postPicMiddleware , uploadPost)
Router.route('/').get(getPost)
module.exports = Router