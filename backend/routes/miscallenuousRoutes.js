const express = require("express");
const Router = express.Router();
const {
  getForumWithRequest,
  getThreadsByMe,
} = require("../controllers/miscallenuousController");

Router.route("/withForumRequest").get(getForumWithRequest);
Router.route("/threadsByMe").get(getThreadsByMe);

module.exports = Router;

