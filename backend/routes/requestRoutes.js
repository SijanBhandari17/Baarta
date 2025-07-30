const express = require('express')
const Router = express.Router()
const {sendInvite , getInvitation , acceptInvitation , getJoinRequest, acceptJoinRequest , removeForumInvite , removeForumRequest} = require('../controllers/requestController')

Router.route('/sendInvite').post(sendInvite) // this router works for three different kind of posts , one for promotion to moderator , another one for join_request, finally for forum_invite
Router.route('/getInvite').get(getInvitation) // this get the request to join the forum or accept the invitation to become the moderator 
Router.route('/acceptInvite').post(acceptInvitation) // this is to accept invitation to either become modeartor or to be a member of the forum
// Router.route('/getJoinInvite').get(getJoinRequest) // this is for modeartor and admin to see the applications to join the forum
Router.route('/acceptJoinInvite').post(acceptJoinRequest) // this is for moderator and admin to accept the application to join the forum
Router.route('/removeInvite').delete(removeForumInvite) // this is to delete the request for becoming the moderator or joinig the forum by the user not the admin or moderator
Router.route('/removeRequest').delete(removeForumRequest)
module.exports = Router
