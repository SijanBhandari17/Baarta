const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pollSchema = new Schema({
  title : {type : String , required : true},
  forumId : {type : mongoose.Schema.Types.ObjectId , ref : 'Forum'},
  option: [
    {
      name: { type: String, required: true },
      voter_Id: [{type : mongoose.Schema.Types.ObjectId, ref : 'User'}],
    },
  ],
  authorId : {type : mongoose.Schema.Types.ObjectId , ref : 'User'}
});
module.exports = mongoose.model("Poll", pollSchema);

