const mongoose = require('mongoose')
const Schema =  mongoose.Schema

const notificationSchema = new Schema({
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  },

  type: {
    type: String,
    enum: ['join_request', 'forum_invite'], // join_request = user → admin/mod, forum_invite = admin/mod → user
    required: true
  },

  date : {type : String , required : true , default : Date.now}
});

module.exports = mongoose.model('Notification', notificationSchema);
