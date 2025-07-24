const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Profile = require('../models/profilePicModel')
const mongoose = require('mongoose')

const addReplyToComment= async (req , res)=>{
    const session = await mongoose.startSession()
    try
    { 
        await session.startTransaction()
        if(!req.body?.reply) return res.status(400).json({"error" : "the reply header missing in the request object"})
        if(!req.body?.commentId) return res.status(400).json({"error" : "the commentId header missing in the request object"})
        if(!req.user) return res.status(401).json({"error" : "user header missing in the request object"})
        const reply = req.body.reply
        const commentId = req.body.commentId
        const email = req.user.email
        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser) 
        {
            await session.abortTransaction()
            return res.status(404).json({'error' : 'username not found error'})
        }
        const foundComment = await Comment.findOne({_id: commentId}).session(session).exec()
        if(!foundComment) {
            await session.abortTransaction()
            return res.status(404).json({"error" : "comment either deleted or not found"})
        }
        
        const result = await Comment.create([{
            parent : { kind : 'Comment' , parent_id : commentId },
            author_id : foundUser._id,
            text : reply,
        }] , {session}) 
    
        const profilePic = await Profile.findOne({userId : foundUser._id}).session(session).exec()

        const toSendResult = {...result , authorName : foundUser.username , authorEmail : foundUser.email , authorProfilePicLink : profilePic?.profilePicLink} 

        foundComment.replies_id = [...foundComment.replies_id , result[0]._id]
        await foundComment.save({session})
        await session.commitTransaction()
        return res.status(201).json({"message" : 'successfully added reply' , "body" : toSendResult})
    }
    catch(err)
    {
        await  session.abortTransaction()
        return res.status(500).json({"err" : `${err.message} haha  `})
    }
    finally{
        await session.endSession()
    }
}
const removeReplyFromComment = async (req , res)=>{
    const session = await mongoose.startSession()
    try
    { 
        await session.startTransaction()
        if(!req.body?.replyId) return res.status(400).json({"error" : "the reply Id header missing in the request object"})
        if(!req.user?.email) return res.status(401).json({"error" : "the email is missing in the request header"}) 
        const replyId = req.body.replyId
        const email = req.user.email
        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser) 
        {
            await session.abortTransaction()
            return res.status(404).json({'error' : 'username not found error'})
        }
        const foundReply = await Comment.findOne({_id : replyId}).session(session).exec()
        if(!foundReply) {
            await session.abortTransaction()
            return res.status(404).json({"error" : "reply already deleted or removed "})
        }
        const replyAuthor = await User.findOne({_id : foundReply.author_id}).session(session).exec()
        if(!replyAuthor){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the account might've been deleted"})
        }
        if(replyAuthor._id.toString() !== foundUser._id.toString()) {
           await session.abortTransaction()
           return res.status(403).json({"error": "unauthorized access to the comment"}) 
        }

        // const foundPost = await Post.findOne({comment_id : foundComment._id}).session(session).exec()
        
        // if(!foundPost){
        //     await session.abortTransaction()
        //     return res.status(404).json({"error" : "the post might have been deleted or cleared "})
        // }
        await Comment.deleteOne({_id : replyId}, {session})
        const result = await Comment.updateOne({_id : foundReply.parent.parent_id} , {$pull :  { replies_id : replyId }} , {session})
        await session.commitTransaction()
        return res.status(201).json({"message" : 'successfully added comment' , "body" : result})
    }
    catch(err)
    {
        await  session.abortTransaction()
        return res.status(500).json({"err" : `${err.message} haha  `})
    }
    finally{
        await session.endSession()
    }

}
const updateReplyFromComment = async (req,  res)=>{
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()
        if(!req.body?.replyId) return res.status(400).json({"error" : `missing replyId in the request header`})
        if(!req.user) return res.status(401).json({"error" : 'the email is missing in the request header'})
        if (!req.body?.text) return res.status(400).json({"error" : 'the updated text is missing in the request header'})
        const replyId = req.body.replyId
        const email = req.user.email
        const text = req.body.text        
        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : 'username not found'})
        }

        const foundReply = await Comment.findOne({_id : replyId}).session(session).exec()
        if(!foundReply){
            await session.abortTransaction()
            return res.status(404).json({"error" : 'the reply is deleted or removed'})
        }

        if(foundUser._id.toString() !== foundReply.author_id.toString()){
            await session.abortTransaction()
            return res.status(403).json({"error" : "not authorized to do update others info"})
        }

        foundReply.text = text

        const result = await foundReply.save({session})

        await session.commitTransaction()
        res.status(201).json({"message" : 'successfully changed the comment' , 'body': result})

    }
    catch(err)
    {
        await session.abortTransaction()
        res.status(500).json({"error" : `${err.message}`}) 
    }
    finally {
        await session.endSession()
    }
}

const getReplyFromComment = async (req ,res)=>{
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()

        if(!req.query?.commentId) return res.status(400).json({"error" : `missing commentId in the request header`})
        if(!req.user?.email) return res.status(401).json({"error" : 'the email is missing in the request header'})

        const {commentId} = req.query

        const foundComment = await Comment.findOne({_id : commentId}).session(session).exec()
        if(!foundComment){
            await session.abortTransaction()
            return res.status(404).json({"error" : 'the comment is deleted or removed'})
        }

        const foundReplyArr = await Comment.find({"parent.parent_id" : commentId}).session(session).exec()

        const toSendReplyArr = await Promise.all(foundReplyArr.map(async (item)=>{

            const foundAuthor = await User.findOne({_id : item.author_id}).session(session).exec()
            const foundAuthorProfile = await Profile.findOne({userId : foundAuthor?._id}).session(session).exec()
            
            const toReturnArray = {...item.toObject() , authorName :foundAuthor?.username || '[deleted user]' , authorEmail : foundAuthor?.email || '[deleted user]' , authorProfilePicLink : foundAuthorProfile?.profilePicLink || 'https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg'}
            
            return toReturnArray
        }))

        await session.commitTransaction()

        res.status(200).json({"message" : "successful retrieval of comments" , "body" : toSendReplyArr})

    }
    catch(err)
    {
        await session.abortTransaction()
        res.status(500).json({"error" : `${err.stack}`})
    }
    finally
    {
        await session.endSession()
    }
}

module.exports = {addReplyToComment , removeReplyFromComment ,  getReplyFromComment , updateReplyFromComment}