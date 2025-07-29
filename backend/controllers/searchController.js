const Notification = require('../models/inviteNotificationModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Profile = require('../models/profilePicModel')
const Forum = require('../models/forumModel')
const mongoose = require('mongoose')
const {calculateCosineSimilarity} = require('../config/cosineSimilarity')
const searchPost = async (req , res)=>{
    const session = await mongoose.startSession()

    try{
        await session.startTransaction()

        if(!req.body?.forumId) return res.status(400).json({"error" : "the forumId is missing the request headers"})
        if(!req.user?.email) return res.status(401).json({"error" : "unauthenticated user request sent"})
        if(!req.body?.searchQuery) return res.status(400).json({"error" : "the searchQuery is missing the request headers"})
        const {forumId , searchQuery} = req.body
        const {email} = req.user

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user account is either deleted or removed"})
        }

        const foundForum = await Forum.findOne({_id : forumId}).session(session).exec()
        if(!foundForum){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the forum was either deleted or removed"})
        }

        const postArr = foundForum.post_id

        const foundPostArr = await Post.find({_id : {$in : postArr}}).session(session).exec()

        const toSendResult = foundPostArr.map((item) =>{
            const cosineVal = calculateCosineSimilarity(searchQuery , item.title)
            return {...item.toObject() , cosineVal}
        })

        toSendResult.sort((a,  b) =>   b.cosineVal - a.cosineVal  )

        await session.commitTransaction()
        return res.status(200).json({"message" : "successfull retrieval" , "body" : toSendResult} )

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

module.exports = {searchPost}