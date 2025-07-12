const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const profilePicSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    profilePicLink : {type : String , required : true }
})
module.exports = mongoose.model('Profilepic' , profilePicSchema)