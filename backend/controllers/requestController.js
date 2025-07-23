const Notification = require('../models/inviteNotificationModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Profile = require('../models/profilePicModel')
const Forum = require('../models/forumModel')
const mongoose = require('mongoose')
const { rmSync } = require('fs')

const sendInvite = async (req ,res)=>{
    const session = await mongoose.startSession()

    try{
        
        await session.startTransaction()

        if(!req.body?.forumId) return res.status(400).json({"error" : "forumId missing in the request header"})
        if(!req.body?.userId) return res.status(400).json({"error" : "userId missing in the request header"})
        if(!req.user?.email) return res.status(401).json({"error" : "unauthenticated user request sent"})
        const {forumId , userId } = req.body
        const {email} = req.user

        const foundUser = await User.findOne({email}).session(session).exec() 
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "user account deleted or removed"})
        }

        const foundForum = await Forum.findOne({_id : forumId}).session(session).exec() 
        if(!foundForum){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the forum is either deleted or removed"}) // the forum could be deleted after the request is sent
        }
        const foundReciepent = await User.findOne({_id : userId}).session(session).exec()
        if(!foundReciepent)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "no such reciepent"})
        }

        if(foundForum.admin_id.toString() === foundReciepent._id.toString() || foundForum.moderator_id.includes(foundReciepent._id) || foundForum.member_id.includes(foundReciepent._id))
        {
            await session.abortTransaction()
            return res.status(409).json({"error" : "the user is already a part of this forum"})
        }

        if(foundUser._id.toString() !== foundForum.admin_id.toString() && !foundForum.moderator_id.includes(foundUser._id))
        {
            await session.abortTransaction()
            return res.status(403).json({"error" : "unauthorized request sent"})
        }

        const duplicateRequest = await Notification.findOne({forum : foundForum._id , $or : [{toUser : userId} , {fromUser : userId}]}).session(session).exec()
        console.log(duplicateRequest) 
        if(duplicateRequest)
        {
            await session.abortTransaction()
            return res.status(409).json({"error" : "Here the user has either already sent the request to join the forum or the request has already been sent to the user to join the forum"})

        }
        const result = await Notification.create([
            {
               toUser : userId,
               fromUser : foundUser._id,
               forum : forumId,
               type : 'forum_invite' 
            }
        ] , {session})


        await session.commitTransaction()

        res.status(201).json({"message" : "the invitation was sent successfully" , "body" : result})

    }
    catch(err)
    {
        await session.abortTransaction()
        return res.status(500).json({"error" : `${err.stack}`})
    }
    finally
    {
        await session.endSession()
    }

}

const getInvitation = async (req, res)=>{
    const session = await mongoose.startSession()
    try{
    await session.startTransaction() 
    
    if(!req.user?.email) return res.status(401).json({"error" : "unauthenticated request sent"})
    
    const {email} = req.user

    const foundUser = await User.findOne({email}).session(session).exec()
    if(!foundUser){
        await session.abortTransaction()
        return res.status(404).json({"error" : "the user was either deleted or removed"})
    }

    const invitationArr = await Notification.find({toUser : foundUser._id}).session(session)

    const toSendArr = await Promise.all(invitationArr.map(async(item)=>{
        const sender = item.fromUser
        const forum = item.forum 

        const foundSender = await User.findOne({_id : sender}).session(session).exec()

        const foundSenderImage = await Profile.findOne({userId : foundSender?._id}).session(session).exec()

        const foundForum = await Forum.findOne({_id : forum}).session(session).exec()

        const toReturnObj = {...item.toObject(), senderName:foundSender?.username || '[deleted user]' , forumName : foundForum?.forum_name , senderProfilePicLink : foundSenderImage?.profilePicLink || 'https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg'}
        
        
        return toReturnObj

    }))


    await session.commitTransaction() 

    res.status(200).json({"message" : "successful retrieval of notification" , "body" : toSendArr})

    }
    catch(err){
        await session.abortTransaction()
        return res.status(500).json({"error" : `${err.stack}`})
    }
    finally{
        await session.endSession()
    }
}

module.exports = {sendInvite , getInvitation}
