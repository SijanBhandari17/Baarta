const express = require("express");
const Router = express.Router();
const {
  createForum,
  getForum,
  deleteForum,
  updateForum,
} = require("../controllers/forumController");

Router.route("/").post(createForum);
Router.route("/").get(getForum);
Router.route("/").delete(deleteForum);
Router.route("/").put(updateForum);
module.exports = Router;

