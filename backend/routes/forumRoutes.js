const express = require("express");
const Router = express.Router();
const {
  createForum,
  getForum,
  deleteForum,
  updateForum,
  leaveForum
} = require("../controllers/forumController");

Router.route("/").post(createForum);
Router.route("/").get(getForum);
Router.route("/").delete(deleteForum);
Router.route("/").put(updateForum);
Router.route("/leave").put(leaveForum)
module.exports = Router;

