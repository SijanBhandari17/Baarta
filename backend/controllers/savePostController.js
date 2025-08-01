const Notification = require('../models/inviteNotificationModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Profile = require('../models/profilePicModel')
const Forum = require('../models/forumModel')
const mongoose = require('mongoose')
const profilePicModel = require('../models/profilePicModel')

const savePost = async(req ,res)=>{
    const session = await mongoose.startSession()
    try
    {

        await session.startTransaction()

        if(!req.body?.postId) return res.status(400).json({"error" : "missing postId in the request header"})

        const {postId} = req.body

        if(!req.user?.email) return res.status(400).json({"error" : "unauthenticated user sent the request"})

        const {email} =  req.user

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "user not found"})
        }

        const foundPost = await Post.findOne({_id : postId}).session(session).exec()
        if(!foundPost) 
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "the post is either deleted or removed"})
        }

        foundUser.save_post = [...foundUser.save_post , foundUser._id]

        const result = await foundUser.save({session})

        const foundAuthor = await User.findOne({_id : foundPost.author_id}).session(session).exec()

        const foundAuthorProfilePic = await profilePicModel.findOne({userId : foundAuthor._id}).session(session).exec()

        const toSendResult = {...foundPost.toObject() , authorName : foundAuthor.username , authorEmail : foundAuthor.email , authorProfilePicLink : foundAuthorProfilePic?.profilePicLink ||    "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg" }

        await session.commitTransaction()

        res.status(201).json({"message" : "successfully saved posts" , "body" : toSendResult})
         
    }

    catch(err)
    {
        await session.abortTransaction()
        res.status(500).json({"error" : `${err.stack}`})
    }
    finally{
        await session.endSession()
    }

} 

module.exports = {savePost}