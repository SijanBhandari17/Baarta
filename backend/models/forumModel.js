const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const forumSchema = new Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  forum_name: { type: String, required: true },
  moderator_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  member_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  date: { type: Number, required: true, default: Date.now },
  description_text: { type: String, required: true },
  post_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  request_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  discussion_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discussion" }],
  poll_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
  genre: {
    type: String,
    enum: [
      "AI",
      "EdTech",
      "Research",
      "Climate",
      "Literature",
      "Analysis",
      "Quantum",
      "Research",
    ],
    required: true,
  },
});
module.exports = mongoose.model("Forum", forumSchema);

