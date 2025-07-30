const express = require('express')
const Router = express.Router()
const {searchPost} = require('../controllers/searchController')

Router.route('/post').post(searchPost) // although this should've been get request however using get request in POSTMAN for testing is pain in the butt so i am using post request for now 

module.exports = Router