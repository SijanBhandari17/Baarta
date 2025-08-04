const Notification = require('../models/inviteNotificationModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Profile = require('../models/profilePicModel')
const Forum = require('../models/forumModel')
const Poll = require('../models/pollModel')
const Disucssion = require("../models/discussionModel")
const mongoose = require('mongoose')

const sendAllUser = async (req ,res)=>{
    const session = await mongoose.startSession()

    try
    {

        await session.startTransaction()
        if(!req.query?.forumId) return res.status(400).json({"error" : "missing forumId in the request header"})
        if(!req.user?.email) return res.status(401).json({"error" : 'unauthenticated user request sent'})
        
        const {email}  = req.user
        const {forumId} = req.query

        const foundUser = await User.findOne({email}).session(session).exec() 
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user account is either deleted or removed"})
        }

        const foundForum = await Forum.findOne({_id : forumId}).session(session).exec()
        if(!foundForum)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "the forum was already deleted or removed"})
        }

        const foundUserAcc = await User.find().session(session).exec()

        if(foundUserAcc.length <= 1){ // 1 because your account ofcourse exists otherwise the server doesn't process up to this part 
            await session.abortTransaction()
            return res.status(404).json({"message" : "all the user account are deleted"})
        }
        const foundJoinRequest = await Notification.find({forum : foundForum._id , type : 'join_request'}).session(session)
        const foundInviteRequest = await Notification.find({forum : foundForum._id , type : 'forum_invite'}).session(session)
        const foundJoinRequestUser = foundJoinRequest.map(item => item.fromUser.toString())
        const foundInviteRequestUser = foundInviteRequest.map(item => item.toUser.toString())
        const filteredUserAcc = foundUserAcc.filter((item)=>{
            if((item._id.toString() !==  foundUser._id.toString()) &&  foundForum.admin_id.toString() !== item._id.toString() && !foundForum.member_id.includes(item._id) && !foundForum.moderator_id.includes(item._id) && !foundJoinRequestUser.includes(item._id.toString()) && !foundInviteRequestUser.includes(item._id.toString())) return true
            else return false
        })

        const toSendBody = await Promise.all(filteredUserAcc.map(async (item) =>{

            const foundProfilePicLink = await Profile.findOne({userId : item._id}).session(session).exec()

            return {
                _id : item._id,
                username: item.username,
                profilePicLink : foundProfilePicLink?.profilePicLink ||   "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg" ,
                userEmail : item.email
            }
        }))

        await session.commitTransaction()

        return res.status(200).json({"message" : "successful retrieval of users" , "body" : toSendBody })
    }

    catch(err)
    {
        await session.abortTransaction()
        return res.status(500).json({"error" : `${err.stack}`})
    }
    finally{
        await session.endSession()
    }

}

const sendAllForum = async (req ,res)=>{
    const session = await mongoose.startSession()

    try
    {

        await session.startTransaction()

        if(!req.user?.email) return res.status(401).json({"error" : 'unauthenticated user request sent'})
        
        const {email}  = req.user

        const foundUser = await User.findOne({email}).session(session).exec() 
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user account is either deleted or removed"})
        }

        const foundForumArr = await Forum.find().session(session).exec()

        await session.commitTransaction()

        return res.status(200).json({"message" : "all forums sent" , "body" : foundForumArr})

    }

    catch(err)
    {
        await session.abortTransaction()
        return res.status(500).json({"error" : `${err.stack}`})
    }
    finally{
        await session.endSession()
    }

}

const sendOneUser = async (req ,res)=>{

    const session = await mongoose.startSession()

    try
    {

        await session.startTransaction()

        if(!req.user?.email) return res.status(401).json({"error" : 'unauthenticated user request sent'})
        if(!req.query?.userId) return res.status(400).json({"error" : "missing userId in the query"}) 

        const {userId} = req.query

        const foundToSearchUser = await User.findOne({_id : userId}).session(session).exec()
        if(!foundToSearchUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user account doesn't exists"})
        }

        const foundSearchUserProfile = await Profile.findOne({userId : foundToSearchUser._id}).session(session).exec()

        const toSendBody = {...foundToSearchUser.toObject() , userProfilePicLink : foundSearchUserProfile?.profilePicLink || "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg"}

        await session.commitTransaction()

        return res.status(200).json({"message" : "all forums sent" , "body" : toSendBody})

    }

    catch(err)
    {
        await session.abortTransaction()
        return res.status(500).json({"error" : `${err.stack}`})
    }
    finally{
        await session.endSession()
    }
}

const sendAllPolls = async(req, res)=>{
    const session = await mongoose.startSession()

    try
    {

        await session.startTransaction()

        if(req.user?.email) return res.status(401).json({"error" : "unauthenticated user sent the request"})
        
        const {email} = req.user 
        
        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user account was either deleted or removed"})
        }

        const joinForumArr = await Forum.find({member_id : foundUser._id}).session(session)
        if(joinForumArr.length === 0 )
        {
            await session.commitTransaction()
            await session.endSession()
            return res.status(200).json({"message" : "polls successfully found" , "body":[]})
        } 

        const joinForumIdArr = joinForumArr.map(item => item._id.toString())

        const joinForumPollArr = await Poll.find({forumId : {$in : joinForumIdArr}}).session(session).exec()

        const toSendBody = await Promise.all(joinForumPollArr.map(async(item)=>{
            const authorId = await User.findOne({_id : item.authorId}).session(session).exec()
            const authorProfilePic= await Profile.findOne({userId : authorId._id}).session(session).exec()
            
            return {...item.toObject() , authorName : authorId.username , authorEmail : authorId.email , authorProfilePicLink : authorProfilePic?.profilePicLink || "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg" }


        })) 

        await session.commitTransaction()

        return res.status(200).json({"message" : "polls successfully found" , "body" : toSendBody})

    }

    catch(err)
    {
        await session.abortTransaction()
        return res.status(500).json({"error" : `${err.stack}`})
    }
    finally{
        await session.endSession()
    }

}

module.exports = {sendAllUser , sendAllForum , sendOneUser , sendAllPolls}
