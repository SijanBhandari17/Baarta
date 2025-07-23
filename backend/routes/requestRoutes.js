const express = require('express')
const Router = express.Router()
const {sendInvite , getInvitation} = require('../controllers/requestController')

Router.route('/sendInvite').post(sendInvite)
Router.route('/getInvite').get(getInvitation)
module.exports = Router
