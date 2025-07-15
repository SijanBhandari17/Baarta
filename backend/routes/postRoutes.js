const express = require('express')
const Router = express.Router()
const {uploadPost} = require('../controllers/postController')
const postPicMiddleware = require('../middleware/cloudinaryPostPicMiddleware')
Router.route('/').post(postPicMiddleware , uploadPost)
module.exports = Router