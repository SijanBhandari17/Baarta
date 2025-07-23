const express = require('express')
const Router = express.Router()
const {sendInvite , getInvitation , acceptInvitation , getJoinRequest} = require('../controllers/requestController')

Router.route('/sendInvite').post(sendInvite)
Router.route('/getInvite').get(getInvitation)
Router.route('/acceptInvite').post(acceptInvitation)
Router.route('/getJoinInvite').get(getJoinRequest)
module.exports = Router
