const express = require('express')
const Router = express.Router()
const {handleDashBoard}  = require('../controllers/dashboardController')
Router.route('/').get(handleDashBoard)
module.exports = Router