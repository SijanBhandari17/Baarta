const Notification = require('../models/inviteNotificationModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Profile = require('../models/profilePicModel')
const Forum = require('../models/forumModel')
const mongoose = require('mongoose')

const sendInvite = async (req ,res)=>{
    const session = await mongoose.startSession()

    try{
        
        await session.startTransaction()

        if(!req.body?.forumId) return res.status(400).json({"error" : "forumId missing in the request header"})
        if(!req.body?.type) return res.status(400).json({"error" : "type missing in the request header"})
        if(!req.user?.email) return res.status(401).json({"error" : "unauthenticated user request sent"})
        
        const {forumId , userId , type} = req.body
        const {email} = req.user

        if(!req.body?.userId && type !== 'join_request') return res.status(400).json({"error" : " userId missing in the request header"})
    
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
        let foundReciepent;
        if(type !== 'join_request')
        { 
            foundReciepent = await User.findOne({_id : userId}).session(session).exec()
            if(!foundReciepent )
            {
                await session.abortTransaction()
                return res.status(404).json({"error" : "no such reciepent"})
            }
        }

        if(foundUser._id.toString() !== foundForum.admin_id.toString() && !foundForum.moderator_id.includes(foundUser._id) && type !== 'join_request')
            {
                await session.abortTransaction()
                return res.status(403).json({"error" : "unauthorized request sent"})
            }

        let duplicateRequest;
        
        if (type === 'join_request') {
            duplicateRequest = await Notification.findOne({
            forum: foundForum._id,
            fromUser: foundUser._id, // current user sending the join request
            type: 'join_request'
            }).session(session).exec();
        } 
        else {
            duplicateRequest = await Notification.findOne({
            forum: foundForum._id,
            $or: [
            { toUser: userId, type: 'forum_invite' },
            { fromUser: userId, type: 'join_request' },
            {toUser :userId , type:'promote_to_moderator'}
            ]
            }).session(session).exec();
        }
            
        if(duplicateRequest)
        {
            await session.abortTransaction()
            return res.status(409).json({"error" : " the user has already request or the user has been request by the forum already"})
        }

        let result;

        if(type === 'promote_to_moderator')
        {
            if(!foundForum.member_id.includes(foundReciepent._id))            
            {
                await session.abortTransaction()
                return res.status(404).json({"error" : "couldn't find such memeber to promote inside of the forum"})
            }

            if(foundForum.moderator_id.includes(foundReciepent._id) || foundForum.admin_id === foundReciepent._id) 
            {
                await session.abortTransaction()
                return res.status(409).json({"error" : "The user is already either an admin or a moderator"})
            }
            
            result = await Notification.create([
                {
                toUser : userId,
                fromUser : foundUser._id,
                forum : forumId,
                type : 'promote_to_moderator' 
                }
            ] , {session})
            
                
        }
            
        else if(type === 'forum_invite')
        { 
            if(foundForum.admin_id.toString() === foundReciepent._id.toString() || foundForum.moderator_id.includes(foundReciepent._id) || foundForum.member_id.includes(foundReciepent._id))
            {
                await session.abortTransaction()
                return res.status(409).json({"error" : "the user is already a part of this forum"})
            }
            

            result = await Notification.create([
                {
                toUser : userId,
                fromUser : foundUser._id,
                forum : forumId,
                type : 'forum_invite' 
                }
            ] , {session})
        }

        else if(type === 'join_request')
        {
            if(foundForum.admin_id.toString() === foundUser._id.toString() || foundForum.moderator_id.includes(foundUser._id) || foundForum.member_id.includes(foundUser._id))
            {
                await session.abortTransaction()
                return res.status(409).json({"error" : "the user is already part of this forum"})
            }
            
            result = await Notification.create([
            { 
                toUser : null, 
                fromUser : foundUser._id,
                forum : forumId,
                type : 'join_request'        
            }
            ] , {session})
        }
        else
        {
            await session.abortTransaction()
            return res.status(400).json({"error" : "no such types for invitation or request"})
        }


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

const acceptInvitation = async (req , res) =>{

    const session = await mongoose.startSession()
    try{

        await session.startTransaction()

        if(!req.body?.notificationId) return res.status(400).json({"error" : "missing notificationId in the request header"})
        if(!req.user?.email) return res.status(401).json({"error" :"unauthenticated user sent the request"})

        const {notificationId} = req.body
        const {email} = req.user

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user was either deleted or removed"})
        }
        
        const foundNotification = await Notification.findOne({_id : notificationId , $or : [{type : 'forum_invite'} , {type : 'promote_to_moderator'}]}).session(session).exec()
        if(!foundNotification){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the notification was either deleted or removed"})
        }

        if(foundNotification.toUser.toString() !== foundUser._id.toString())
        {
            await session.abortTransaction()
            return res.status(403).json({"error" : "the request wasn't sent to you "})
        }
        
        const forumId = foundNotification.forum
        const type = foundNotification.type

        const foundForum = await Forum.findOne({_id : forumId}).session(session).exec()
        if(!foundForum)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : 'the forum was either deleted or removed after the request was sent'})
        }
        
        let result

        if(type === 'forum_invite')
        {
        foundForum.member_id = [...foundForum.member_id , foundUser._id]
        
        result = await foundForum.save({session})
        }
        else if (type === 'promote_to_moderator')
        {
            await Forum.updateOne({_id : foundForum._id} , {$pull : {member_id : foundUser._id}} , {session})

            foundForum.moderator_id = [...foundForum.moderator_id , foundUser._id]

            result = await foundForum.save({session})
        }
    
        await Notification.deleteOne({_id : foundNotification._id} , {session})

        await session.commitTransaction()

        res.status(201).json({"message" : "the invitation has been successfully accepted " , "body" : result})        

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
const getJoinRequest = async(req ,res)=>{

    const session = await mongoose.startSession()

    try{
        await session.startTransaction()

        if(!req.query?.forumId) return res.status(400).json({"error" : "forumId is missing in the query parameter"})
        if(!req.user?.email) return res.status(401).json({"error" : 'unauthenticated user request sent'})
        
        const {forumId} = req.query
        const {email} = req.user

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "user with such id not found"})
        }

        const foundForum = await Forum.findOne({_id : forumId}).session(session).exec()
        if(!foundForum){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the forum is either deleted or removed"})
        }
        
        if(foundForum.admin_id.toString() !== foundUser._id.toString() && !foundForum.moderator_id.includes(foundUser._id) ){
            await session.abortTransaction()
            return res.status(403).json({"error" : "you aren't authorized to view that information"})
        }

        const requestNotifactionArr = await Notification.find({forum : foundForum._id , type : 'join_request'}).session(session).exec()
        
        const toSendNotificationArr = await Promise.all(requestNotifactionArr.map(async (item) =>{
            const sentByUser = await User.findOne({_id : item.fromUser}).session(session).exec()
            const sentByUserProfilePic = await Profile.findOne({userId : sentByUser?._id}).session(session).exec()
            
            const toReturnObj = {...item.toObject() , senderEmail : sentByUser?.email || '[deleted user]' , senderName : sentByUser?.username || '[deleted user]' , senderProfilePicLink : sentByUserProfilePic?.profilePicLink || 'https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg' }

            return toReturnObj
        }))

        await session.commitTransaction()
        res.status(200).json({"message" : "the join request received successfully" , "body" : toSendNotificationArr})

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

const acceptJoinRequest = async (req, res)=>{
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()
       
        if(!req.body?.notificationId) return res.status(400).json({"error" : "notification Id missing the req header "})
        if(!req.user?.email) return res.status(401).json({"error" : "unaunthenticated request sent by the user"})
        
        const {notificationId} = req.body
        const {email} = req.user

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user was either deleted or removed"})
        }
        
        const foundNotification = await Notification.findOne({_id : notificationId , type : 'join_request'}).session(session).exec()
        if(!foundNotification){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the notification was either deleted or removed"})
        }

        const forumId = foundNotification.forum

        const foundForum = await Forum.findOne({_id : forumId}).session(session).exec()

        if(!foundForum)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "the forum was either deleted or removed"})
        }

        if(foundForum.admin_id.toString() !== foundUser._id.toString() && !foundForum.moderator_id.includes(foundUser._id))
        {
            await session.abortTransaction()
            return res.status(403).json({"error" : "unauthorized request sent"})
        }

        const requestedUser = foundNotification.fromUser

        const foundRequestedUser = await User.findOne({_id : requestedUser}).session(session).exec()
        if(!foundRequestedUser) 
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user who sent request is either deleted or removed"})
        }

        foundForum.member_id = [...foundForum.member_id , foundRequestedUser._id]
        
        await Notification.deleteOne({_id : foundNotification._id} , {session})

        const result = await foundForum.save({session})

        await session.commitTransaction()
        res.status(201).json({"message" : "the user has successfully been entered into the forum" , "body" : result})

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

const removeForumInvite = async (req, res)=>{ // this is to remove the invitation sent by either the moderator or the admin to remove the user 
    // since the invitation can only be veiwed by teh reciepient it is just not possible for the moderator or admin to delete it so it's cool
    // this not only removes the invitation but also removes the promotion to moderator as well
    const session = await mongoose.startSession()
    try
    {
        await session.startTransaction()
        if(!req.body?.notificationId) return res.status(400).json({"error" : "notificationId missing in the "})
        if(!req.user?.email) return res.status(401).json({"error" : "unauthenticated user sent the request"})

        const {notificationId} = req.body
        const {email} = req.user

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user was either deleted or removed"})
        }
        
        const foundNotification = await Notification.findOne({_id : notificationId}).session(session).exec()
        if(!foundNotification){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the notification was either deleted or removed"})
        }

        if(foundUser._id.toString() !== foundNotification.toUser.toString())
        {
            await session.abortTransaction()
            return res.status(403).json({"error" : "you don't have the permission to remove that message"})
        }

        const result = await Notification.deleteOne({_id : foundNotification._id} , {session})

        await session.commitTransaction()
        res.status(201).json({"message" : "Successfull deletion of the notificationID" , "body" : result})
    }
    catch(err)
    {
        await session.abortTransaction()
        return res.status(500).json({"error" : `${err}`})
    }
    finally
    {
        await session.endSession()
    }
}

const removeForumRequest = async (req ,res)=>{
    const session = await mongoose.startSession()
    try
    {
        await session.startTransaction()

        if(!req.body?.notificationId) return res.status(400).json({"error" : "notificationId is missing in the request header"})
        if(!req.user?.email) return res.status(401).json({"error" : "unauthenticated user sent the request which is bad"})
        
        const {notificationId} = req.body
        const {email} = req.user

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user account is just deleted or removed "})
        }

        const foundNotification = await Notification.findOne({_id : notificationId}).session(session).exec()
        if(!foundNotification){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the notification is either deleted or removed"})
        }

        const foundForum = await Forum.findOne({_id : foundNotification.forum}).session(session).exec()
        if(!foundForum){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the forum for which the request was sent is either removed or deleted"})
        }

        if(foundForum.admin_id.toString() !== foundUser._id.toString() && !foundForum.moderator_id.includes(foundUser._id))
        {
            await session.abortTransaction()
            return res.status(403).json({"error" : "unauthorized deletion requested"})
        }

        const result = await Notification.deleteOne({_id : foundNotification._id} , {session})
        
        await session.commitTransaction()
        res.status(201).json({"message" : "successfull deletion of the request" , "body" : result})
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

module.exports = {sendInvite , getInvitation , acceptInvitation , getJoinRequest , acceptJoinRequest , removeForumInvite , removeForumRequest}
