const Post = require('../models/postModel')
const Forum = require('../models/forumModel')
const User = require('../models/userModel')
const uploadToCloudinary = require('../config/uploadCloudinaryConfig')
const mongoose = require('mongoose')

const createForum = async (req, res)=>{
    const session = await mongoose.startSession()
    try
    { 
        await session.startTransaction()
        if(!req.body?.forumName) return res.status(400).json({"error" : " forumName missing in the request header"})
        if(!req.body?.discriptionText) return res.status(400).json({"error" : " discription text missing in the request header"})
        if(!req.body?.genre) return res.status(400).json({"error" : 'genre missing in the request header'} )
        if(!req.user) return res.status(401).json({"error" : "not aunthenticated "})
        
        const {forumName , discriptionText , genre} = req.body
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
            description_text : discriptionText,
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

module.exports = {createForum}