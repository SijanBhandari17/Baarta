const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Profile = require('../models/profilePicModel')
const mongoose = require('mongoose')

const addCommentToPost = async (req , res)=>{
    const session = await mongoose.startSession()
    try
    { 
        await session.startTransaction()
        if(!req.body?.comment) return res.status(400).json({"error" : "the comment header missing in the request object"})
        if(!req.body?.postId) return res.status(400).json({"error" : "the postID header missing in the request object"})
        if(!req.user) return res.status(401).json({"error" : "user header missing in the request object"})
        const comment = req.body.comment
        const postId = req.body.postId
        const email = req.user.email
        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser) 
        {
            await session.abortTransaction()
            return res.status(404).json({'error' : 'username not found error'})
        }
        const foundPost = await Post.findOne({_id : postId}).session(session).exec()
        if(!foundPost) {
            await session.abortTransaction()
            return res.status(404).json({"error" : "post either deleted or not found"})
        }
        
        const result = await Comment.create([{
            parent : { kind : 'Post' , parent_id : postId },
            author_id : foundUser._id,
            text : comment,
        }] , {session}) 
      
        const profilePic = await Profile.findOne({userId : foundUser._id}).session(session).exec()

        const toSendResult = {...result , authorName : foundUser.username , authorEmail : foundUser.email , authorProfilePicLink : profilePic?.profilePicLink} 

        foundPost.comment_id = [...foundPost.comment_id , result[0]._id]
        await foundPost.save({session})
        await session.commitTransaction()
        return res.status(201).json({"message" : 'successfully added comment' , "body" : toSendResult})
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
const removeCommentFromPost = async (req , res)=>{
    const session = await mongoose.startSession()
    try
    { 
        await session.startTransaction()
        if(!req.body?.commentId) return res.status(400).json({"error" : "the comment Id header missing in the request object"})
        if(!req.user?.email) return res.status(401).json({"error" : "the email is missing in the request header"}) 
        const commentId = req.body.commentId
        const email = req.user.email
        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser) 
        {
            await session.abortTransaction()
            return res.status(404).json({'error' : 'username not found error'})
        }
        const foundComment = await Comment.findOne({_id : commentId}).session(session).exec()
        if(!foundComment) {
            await session.abortTransaction()
            return res.status(404).json({"error" : "comment already deleted"})
        }
        const commentAuthor = await User.findOne({_id : foundComment.author_id}).session(session).exec()
        if(!commentAuthor){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the account might've been deleted"})
        }
        if(commentAuthor._id.toString() !== foundUser._id.toString()) {
           await session.abortTransaction()
           return res.status(403).json({"error": "unauthorized access to the comment"}) 
        }

        // const foundPost = await Post.findOne({comment_id : foundComment._id}).session(session).exec()
        
        // if(!foundPost){
        //     await session.abortTransaction()
        //     return res.status(404).json({"error" : "the post might have been deleted or cleared "})
        // }
        await Comment.deleteOne({_id : commentId}, {session})
        const result = await Post.updateOne({_id : foundComment.parent.parent_id} , {$pull :  { comment_id : foundComment._id }} , {session})
        await session.commitTransaction()
        return res.status(201).json({"message" : 'successfully removed comment from the post ' , "body" : result})
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
const updateCommentOfPost = async (req,  res)=>{
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()
        if(!req.body?.commentId) return res.status(400).json({"error" : `missing commentId in the request header`})
        if(!req.user) return res.status(401).json({"error" : 'the email is missing in the request header'})
        if (!req.body?.text) return res.status(400).json({"error" : 'the updated text is missing in the request header'})
        const commentId = req.body.commentId
        const email = req.user.email
        const text = req.body.text        
        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : 'username not found'})
        }

        const foundComment = await Comment.findOne({_id : commentId}).session(session).exec()
        if(!foundComment){
            await session.abortTransaction()
            return res.status(404).json({"error" : 'the comment is deleted or removed'})
        }

        if(foundUser._id.toString() !== foundComment.author_id.toString()){
            await session.abortTransaction()
            return res.status(403).json({"error" : "not authorized to do update others info"})
        }

        foundComment.text = text

        const result = await foundComment.save({session})

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

const getCommentOfPost = async (req ,res)=>{
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()

        if(!req.query?.postId) return res.status(400).json({"error" : `missing commentId in the request header`})
        if(!req.user?.email) return res.status(401).json({"error" : 'the email is missing in the request header'})

        const {postId} = req.query

        const foundPost = await Post.findOne({_id : postId}).session(session).exec()
        if(!foundPost){
            await session.abortTransaction()
            return res.status(404).json({"error" : 'the post is deleted or removed'})
        }

        const foundCommentArr = await Comment.find({"parent.parent_id" : postId}).session(session).exec()

        const toSendCommentArr = await Promise.all(foundCommentArr.map(async (item)=>{

            const foundAuthor = await User.findOne({_id : item.author_id}).session(session).exec()
            const foundAuthorProfile = await Profile.findOne({userId : foundAuthor?._id}).session(session).exec()
            
            const toReturnArray = {...item.toObject() , authorName :foundAuthor?.username || '[deleted user]' , authorEmail : foundAuthor?.email || '[deleted user]' , authorProfilePicLink : foundAuthorProfile?.profilePicLink || 'https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg'}
            
            return toReturnArray
        }))

        await session.commitTransaction()

        res.status(200).json({"message" : "successful retrieval of comments" , "body" : toSendCommentArr})

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

const likeComment = async (req, res)=>{
  const session = await mongoose.startSession()
  try {

    await session.startTransaction()

    if(!req.body?.commentId) return res.status(400).json({"error" : "commentId missing in the request header"})    
    if(!req.user?.email) return res.status(401).json({"error" : "unauthenticated user sent the request"})

    const {commentId} = req.body

    const {email} = req.user

    const foundUser = await User.findOne({email}).session(session).exec() 
    if(!foundUser)
    {
      await session.abortTransaction()
      return res.status(404).json({"error" : "the user account wasn't found at all"})
    }

    const foundComment = await Comment.findOne({_id : commentId}).session(session).exec()
    if(!foundComment)
    {
      await session.abortTransaction()
      return res.status(404).json({"error" : "the post wasn't found at all"})
    }

    if(foundComment.no_of_likes.includes(foundUser._id))
    {
      const index = foundComment.no_of_likes.indexOf(foundUser._id)
      foundComment.no_of_likes.splice(index , 1)
    }
    else
    {
      foundComment.no_of_likes = [...foundComment.no_of_likes , foundUser._id]
    }

    const result = await foundComment.save({session})

    await session.commitTransaction()

    res.status(201).json({"message" : "successfully liked the comment " , "body" : result})


  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `${err.message}` });
  } finally {
    await session.endSession();
  }
}
module.exports = {addCommentToPost , removeCommentFromPost , updateCommentOfPost,  getCommentOfPost, likeComment}