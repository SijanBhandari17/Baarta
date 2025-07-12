const { model } = require('mongoose');
const User = require('../models/userModel')
const pendingUser = require('../models/pendingUser')
const bcrypt = require('bcrypt');
const storeUser = async (req , res)=>{
    const submittedOtp = Number(req.body.otp);
    try { 
    const pendingPerson = await pendingUser.findOne({otp : submittedOtp}).exec() 
    if(!pendingPerson) return res.status(401).json({"error" : "otp not verified"})
    const result = await User.create({
        email : pendingPerson.email,
        password : pendingPerson.password, 
        username : pendingPerson.username 
    })
    await pendingUser.deleteOne({email : pendingPerson.email})
    return res.status(200).json({"message" : "successful insertion" , "result" :result});
    } catch(err) {
        console.log("server error");
       return res.status(500).json({"error" : err.name});
    }
}
module.exports = storeUser