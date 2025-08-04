const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const discussionSchema = new Schema({
  forum_id : {type : mongoose.Schema.Types.ObjectId , ref : "Forum"},
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description:{type : String , required : true},
  post_date: { type: String, required: true, default: Date.now }, // date is kept for the no of millliseconds after thu jan 1 1970 for sorting purposes while recovering them
  end_date : {type : String , required : true}
});
module.exports = mongoose.model("Discussion", discussionSchema);
