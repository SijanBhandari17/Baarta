const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const pendingUserSchema = new Schema({
    username : {type : String , required : true},
    email : {type : String , required: true},
    password : {type : String , required : true},
    otp : {type : Number , required : true}
})
module.exports = mongoose.model('pendinguser' , pendingUserSchema)