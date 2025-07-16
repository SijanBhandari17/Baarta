const express = require('express')
const Router = express.Router()
const {addCommentToPost} = require('../controllers/commentController')
const {removeCommentFromPost} = require('../controllers/commentController')
const {updateCommentOfPost} = require("../controllers/commentController")
Router.route('/').post(addCommentToPost)
Router.route('/').delete(removeCommentFromPost)
Router.route('/').put(updateCommentOfPost)
module.exports =  Router
