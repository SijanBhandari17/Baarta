const Post = require('../models/postModel')
const Forum = require('../models/forumModel')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')
const uploadToCloudinary = require('../config/uploadCloudinaryConfig')
const mongoose = require('mongoose')

const createForum = async (req, res)=>{
    const session = await mongoose.startSession()
    try
    { 
        await session.startTransaction()
        if(!req.body?.forumName) return res.status(400).json({"error" : " forumName missing in the request header"})
        if(!req.body?.descriptionText) return res.status(400).json({"error" : " discription text missing in the request header"})
        if(!req.body?.genre) return res.status(400).json({"error" : 'genre missing in the request header'} )
        if(!req.user) return res.status(401).json({"error" : "not aunthenticated "})
        
        const {forumName , descriptionText , genre} = req.body
        const {email} = req.user 

        const foundUser = await User.findOne({email}).session(session).exec()

        if(!foundUser)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : 'non existent user authenticated'})
        }
        
        const checkForForum = await Forum.findOne({forum_name : forumName}).session(session).exec()
        if(checkForForum)
        {
            await session.abortTransaction()
            return res.status(409).json({"error" : "the forum name already exists"})
        }

        const result = await Forum.create([{
            admin_id : foundUser._id,
            forum_name : forumName,
            description_text : descriptionText,
            genre : genre
        }] , {session})

        await session.commitTransaction()
        res.status(201).json({"message" : 'the forum has been created ' , "body" : result[0]})

    }
    catch(err)
    {
        await session.abortTransaction()
        return res.status(500).json({"error" : `${err.message}`})
    }
    finally{
        await session.endSession()
    }

}

const getForum = async (req , res)=>{
    const session = await mongoose.startSession()
    try
    { 
        await session.startTransaction()
        if(!req.user) return res.status(401).json({"error" : "unaunthenticated user access"})
        
        const {email} = req.user

        const foundUser = await User.findOne({email}).session(session).exec() 

        if(!foundUser)
        {
            await session.abortTransaction()
            res.status(404).json({"message" : "deleted or removed user"})
        }

        const foundForums = await Forum.find({
            $or : [
                {admin_id : foundUser._id},
                {moderator_id : foundUser._id},
                {member_id : foundUser._id}
            ]
            
            }).session(session).exec() 
        if(!foundForums)
        {
            await session.abortTransaction()
            res.status(404).json({"message" : 'no forums joined '})
        }

        await session.commitTransaction()
        res.status(200).json({"message" : "successful retrieval" , "body" : foundForums})
    }
    catch(err)
    {
        await session.abortTransaction()
        res.status(500).json({"error" : `${err.name}`})
    }
    finally{
       await session.endSession() 
    }
}

const deleteForum = async (req,  res) =>{
    const session = await mongoose.startSession()
    try 
    { 
        await session.startTransaction()        

        if(!req.body?.forumId) return res.status(400).json({"error" : "forumId missing in the request header"})
        if(!req.user) return res.status(400).json({"error" : "unaunthenticated user request "})
        
        const {forumId} = req.body

        const {email}  = req.user

        const foundUser = await User.findOne({email}).session(session).exec()

        if(!foundUser)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user account is deleted or removed"})
        }

        const foundForum = await Forum.findOne({_id : forumId}).session(session).exec()

        if(!foundForum)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "the forum is either deleted or non existent"})
        }

        if(foundUser._id.toString() !== foundForum.admin_id.toString())
        {
            await session.abortTransaction()
            return res.status(403).json({"error" : "unauthorized request sent"})
        }

        

        const result = await foundForum.deleteOne({_id : foundForum._id} , {session})
        
        const foundPostArr = await Post.find({parent_forum : foundForum._id }).session(session)
        const foundPostArrId = foundPostArr.map(item => item._id)


        if(!foundPostArr)
        {
            await session.commitTransaction()            
            return res.status(201).json({"message" : "successfull forum deletion " , "body" : result})
        }


        const foundCommentArr = await Comment.find({"parent.parent_id" : {$in : foundPostArrId} }).session(session)

        await Post.deleteMany({parent_forum : foundForum._id } , {session})

        if(!foundCommentArr)
        {
            await session.commitTransaction()
            return res.status(201).json({"message" : "successfull forum deletion " , "body" : result})
        }

        const foundCommentArrId = foundCommentArr.map(item => foundCommentArr._id)  

        await Comment.deleteMany({"parent.parent_id" : {$in : foundPostArrId}}).session(session) 

        await session.commitTransaction()
        res.status(201).json({"message" : "success forum deletion" , "body":result})

        
    }
    catch(err)
    {
        await session.abortTransaction()
        return res.status(500).json({"error" : `${err.message}`})
    }
    finally
    {
        await session.endSession()     
    }
    
}

const updateForum = async (req, res)=>{
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()

        if(!req.body?.forumId) return res.status(400).json({"error" : "the req header is missing forumId"})
        if(!req.user?.email) return res.status(401).json({"error": 'the unauthenticated user signup'})
        const {forumId , forumName, genre , descriptionText} = req.body 
        const {email} = req.user
        
        const foundUser = await User.findOne({email}).session(session).exec()

        if(!foundUser) 
        { 
            await session.abortTransaction()
            return res.status(404).json({"error" : 'user name not registered'})
        }

        const foundForum = await Forum.findOne({_id : forumId}).session(session).exec()
        
        if(!foundForum) 
        { 
            await session.abortTransaction()
            return res.status(404).json({"error" : " the forum is either deleted or removed"})
        }
        
        if(foundUser._id.toString() !== foundForum.admin_id.toString()) 
        { 
            await session.abortTransaction()
            return res.status(403).json({"error" : "unauthorized request sent"})
        }

        foundForum.forum_name = forumName || foundForum.forum_name
        foundForum.description_text = descriptionText || foundForum.description_text
        foundForum.genre = genre || foundForum.genre

        const result = await foundForum.save({session})

        await session.commitTransaction()

        res.status(201).json({"message" : "the forum has been successfully updated" , "body" : result})
        
    }
    catch(err)
    {
        await session.abortTransaction()
        res.status(500).json({"error" : `${err.message}`})
    }
    finally
    {
        await session.endSession()
    }
}

module.exports = {createForum , getForum , deleteForum , updateForum}