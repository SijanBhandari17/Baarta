const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email : {type : String , required: true},
    password : {type : String , required : true} ,
    username : {type : String , required : true} ,
    no_post : Number,
    no_replies : Number,
    forum_id : [Number],
    forum_request_id : [Number],
    refreshToken : String,
    user_role : [
        {
            forum_id : Number,
            role : { type: Number , default : 1 } // 1 is for member 2 is for moderator and 3 is for admin
        }
    ],
    save_post : [{type:mongoose.Schema.Types.ObjectId , ref : 'Post'}  ]
})
module.exports = mongoose.model('User' , userSchema)