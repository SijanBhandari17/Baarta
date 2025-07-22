const express = require('express')
const Router = express.Router()
const {sendInvite} = require('../controllers/requestController')

Router.route('/sendInvite').post(sendInvite)

module.exports = Router
