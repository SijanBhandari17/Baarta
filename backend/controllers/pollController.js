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

const updatePoll = async (req, res)=>{ // here i have made it so that you have to change the 
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()

        if(!req.body?.pollId) return res.status(400).json({"error" : "missing title in the request header"}) 
        if(!req.user?.email) return res.status(401).json({"error" :'unauthentiacted user sent the request'})
        if(!req.body?.options) return res.status(400).json({"error" : "options missing in the request header"})
        
        const {pollId , options , title} = req.body

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

        let alreadyExists = false

        options.forEach(item =>{
            foundPoll.option.forEach(innerItem =>{
                if(innerItem.name === item) alreadyExists = true
            })
        })

        if(alreadyExists)
        {
            await session.abortTransaction()
            return res.status(409).json({"error" : "the options already exists"})
        }


        const toBePostedOptions = options.map(item =>{
            return {name : item , voter_Id : []}
        })

        foundPoll.option = [...foundPoll.option , ...toBePostedOptions]
        if(title.trim().length !== 0) foundPoll.title = title || foundPoll.title
        
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

const deletePollOption = async (req , res) =>{
    const session = await mongoose.startSession()
    try
    {
        await session.startTransaction()

        if(!req.body?.pollId) return res.status(400).json({"error" : 'the pollId was missing from the request header'})
        if(!req.user?.email) return res.status(401).json({"error" : 'uauthenticated user request sent'})
        if(!req.body?.optionVal) return res.status(400).json({"error" : "the options was missing from the request header"})  

        const {pollId , optionVal} = req.body
        const {email} = req.user

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
        

        const result = await Poll.updateOne({ _id: foundPoll._id },{$pull: {option: { name: optionVal }}} , {session});

        await session.commitTransaction()

        res.status(201).json({"message" : "successful deletion" , "body" : result})
        
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

const deletePoll = async (req , res)=>{
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()

        if(!req.body?.pollId) return res.status(400).json({"error" : "pollId is missing in the request header"})
        if(!req.user?.email) return res.status(401).json({"error" : "unauthenticated request sent"})

        const {pollId} = req.body
        const {email} = req.user

        const foundPoll = await Poll.findOne({_id : pollId}).session(session).exec()
        if(!foundPoll)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "the poll must have been deleted "})
        }

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : 'the user account is either deleted or removed'})
        }

        if(foundUser._id.toString() !== foundPoll.authorId.toString())
        {
            await session.abortTransaction()
            return res.status(403).json({"error" : 'unauthorized request sent'})
        }

        const result = await Poll.deleteOne({_id : foundPoll._id}, {session})

        await session.commitTransaction()

        res.status(201).json({"message" : "successful deletion of the post", "body" : result})

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

const votePollOption = async (req , res)=>{
    const session = await mongoose.startSession()
    try{
        await session.startTransaction()

        if(!req.body?.pollId) return res.status(400).json({"error" : "pollId is missing in the request header"})
        if(!req.user?.email) return res.status(401).json({"error" : "unauthenticated request sent"})
        if(!req.body?.option) return res.status(400).json({"error" : "option is missing in the request header"})

        const {pollId , option} = req.body
        const {email} = req.user

        const foundPoll = await Poll.findOne({_id : pollId}).session(session).exec()
        if(!foundPoll)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : "the poll must have been deleted "})
        }

        const foundUser = await User.findOne({email}).session(session).exec()
        if(!foundUser)
        {
            await session.abortTransaction()
            return res.status(404).json({"error" : 'the user account is either deleted or removed'})
        }

        const foundOptionArr = foundPoll.option
        let foundOptionObj
         foundOptionArr.forEach(item =>{
            if(item.name === option) foundOptionObj = item
            else{
                if(item.voter_Id.includes(foundUser._id))
                {
                    const index = item.voter_Id.indexOf(foundUser._id)
                    item.voter_Id.splice(index , 1)
                }
            }
        })

        if(!foundOptionObj){
            await session.abortTransaction()
            return res.status(404).json({"message" : "such option doesn't even exist"})
        }

        if(!foundOptionObj.voter_Id.includes(foundUser._id)) foundOptionObj.voter_Id = [...foundOptionObj.voter_Id , foundUser._id]

        const result = await foundPoll.save({session})

        await session.commitTransaction()
        return res.status(201).json({"message" : "successfully voted" , "body" : result})
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

module.exports = {postPoll , updatePoll , deletePollOption , deletePoll, votePollOption}
 