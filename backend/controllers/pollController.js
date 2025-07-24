const Notification = require('../models/inviteNotificationModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const Profile = require('../models/profilePicModel')
const Forum = require('../models/forumModel')
const Poll = require('../models/pollModel')
const mongoose = require('mongoose')

const postPoll = async (req, res)=>{
    const session = await mongoose.startSession()
    try
    {
        await session.startTransaction()
        if(!req.body?.title) return res.status(400).json({"error" : "missing title in the request header"}) 
        if(!req.body?.forumId) return res.status(400).json({"error" : 'missing forumId in the request header'})
        if(!req.user?.email) return res.status(401).json({"error" : "unaunthenticated user sent the request"})
        if(!req.body?.options) return res.status(400).json({"error" : "options missing in the request header"}) // send this in pure array form but with JSON.stringify ofcourse

        const {forumId , options , title} = req.body
        const {email} = req.user

        if(!Array.isArray(options))
        {
            await session.abortTransaction()
            return res.status(400).json({"error" : "TypeCastError : can't convert options to Array"})
        }

        if(new Set(options).size !== options.length)
        {
            await session.abortTransaction()
            return res.status(409).json({"error" : "Duplicates recieved in the options "})
        }

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user account is deleted or doesn't exists"})
        }

        const foundForum = await Forum.findOne({_id : forumId}).session(session).exec()
        if(!foundForum){
            await session.abortTransaction() 
            return res.status(404).json({"error" : "the forum is either deleted or removed "})
        }

        const toBePostedOptions = options.map(item =>{
            return {name : item , voter_Id : []}
        })

        const result = await Poll.create([{
            title : title,
            forumId : foundForum._id,
            option : toBePostedOptions,
            authorId : foundUser._id
        }] , {session})

        await session.commitTransaction()
        res.status(201).json({"message" : "successfully created the poll" , "body" : result})
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

const addOptionsToPoll = async (req, res)=>{
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()

        if(!req.body?.pollId) return res.status(400).json({"error" : "missing title in the request header"}) 
        if(!req.user?.email) return res.status(401).json({"error" :'unauthentiacted user sent the request'})
        if(!req.body?.options) return res.status(400).json({"error" : "options missing in the request header"})
        
        const {pollId , options} = req.body

        const {email} = req.user

        if(!Array.isArray(options))
        {
            await session.abortTransaction()
            return res.status(400).json({"error" : "TypeCastError : can't convert options to Array"})
        }

        if(new Set(options).size !== options.length)
        {
            await session.abortTransaction()
            return res.status(409).json({"error" : "Duplicates recieved in the options "})
        }

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser){
            await session.abortTransaction()
            return res.status(404).json({"error" : "the user account is deleted or doesn't exists"})
        }

        const foundPoll = await Poll.findOne({_id : pollId}).session(session).exec()
        if(!foundPoll){
            await session.abortTransaction() 
            return res.status(404).json({"error" : "the forum is either deleted or removed "})
        }

        if(foundPoll.authorId.toString() !== foundUser._id.toString())
        {
            await session.abortTransaction()
            return res.status(403).json({"error" : "unauthorized request sent"})
        }


        const toBePostedOptions = options.map(item =>{
            return {name : item , voter_Id : []}
        })

        foundPoll.option = [...foundPoll.option , ...toBePostedOptions]

        const result = await foundPoll.save({session})

        await session.commitTransaction()

        res.status(201).json({"messsage" : "options successfully added "  , "body" : result})


    }
    catch(err)
    {
        await session.abortTransaction()
        return res.status(500).json({"err" : `${err.stack}`})
    }
    finally{
        await session.endSession()
    }
}

module.exports = {postPoll , addOptionsToPoll}