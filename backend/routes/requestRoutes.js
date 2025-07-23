const express = require('express')
const Router = express.Router()
const {sendInvite , getInvitation , acceptInvitation , getJoinRequest, acceptJoinRequest} = require('../controllers/requestController')

Router.route('/sendInvite').post(sendInvite)
Router.route('/getInvite').get(getInvitation)
Router.route('/acceptInvite').post(acceptInvitation)
Router.route('/getJoinInvite').get(getJoinRequest)
Router.route('/acceptJoinInvite').post(acceptJoinRequest)
module.exports = Router
