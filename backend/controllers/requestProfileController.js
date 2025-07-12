const User = require('../models/userModel')
const Profile = require('../models/profilePicModel')
const sendProfilePicture = async (req, res)=>{
    const email = req.user.email
    const user = await User.findOne({email}).exec()
    if(!user) return res.status(400).json({"error" : "bad request sent while accessing profile picture for the first time"})
    const userId = user._id
    const profilePic = await Profile.findOne({userId}).exec()
    if(!profilePic) return res.status(404).json({"error" : "the user doesn't have a profile picture uploaded"})
    const secureUrl = profilePic.profilePicLink
    return res.status(200).json({
        "message" : "profile Picture found",
        "url" : secureUrl
    })
}
module.exports = sendProfilePicture