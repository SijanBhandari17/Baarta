const express = require("express");
const Router = express.Router();
const {
  sendAllUser,
  sendAllForum,
  sendOneUser,
  sendAllPolls,
} = require("../controllers/sendResource");

Router.route("/userprofile").get(sendAllUser);
Router.route("/forum").get(sendAllForum);
Router.route("/singleuserprofile").get(sendOneUser);
Router.route("/poll").get(sendAllPolls);

module.exports = Router;
