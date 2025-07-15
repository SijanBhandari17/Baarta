const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const postSchema = new Schema({
    title : {type : String , required: true},
    content: {
        text : {type : String , required : true},
        location : [{type:Number}], 
        image : String
    },
    post_date : {type:String , required: true , default : Date.now}, // date is kept for the no of millliseconds after thu jan 1 1970 for sorting purposes while recovering them
    author_id : {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required : true} ,
    upvote_id : [{type:mongoose.Schema.Types.ObjectId , ref : 'User' }],
    comment_id : [{type : mongoose.Schema.Types.ObjectId , ref : 'Comment'}],
    forum_id : [{type:mongoose.Schema.Types.ObjectId , ref : "User"}],
    genre : {type : String , enum : ['Question' , 'Announcement' , 'Event']}
})
module.exports = mongoose.model('Post' , postSchema)
//console.log(`the date today is ${new Date(posts.post_date).toDateString()}`)