const express = require("express");
const Router = express.Router();
const {
  getForumWithRequest,
  getThreadsByMe,
  getMemberNotModerator
} = require("../controllers/miscallenuousController");

Router.route("/withForumRequest").get(getForumWithRequest);
Router.route("/threadsByMe").get(getThreadsByMe);
Router.route("/getMemberNotModerator").get(getMemberNotModerator)

module.exports = Router;

