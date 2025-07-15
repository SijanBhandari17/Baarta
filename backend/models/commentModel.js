const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    author_id : {type:mongoose.Schema.Types.ObjectId , ref : 'User' , required : true},
    text : {type:String , required : true},
    replies_id : [{type:mongoose.Schema.Types.ObjectId , ref : 'Comment'}],
    no_of_likes : [{type:mongoose.Schema.Types.ObjectId , ref : 'User'}],
    date : {type : String , required : true , default : Date.now}
})
module.exports = mongoose.model('Comment' , commentSchema)