const express = require("express");
const Router = express.Router();
const {
  uploadPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const postPicMiddleware = require("../middleware/cloudinaryMiddleware");
Router.route("/").post(postPicMiddleware, uploadPost);
Router.route("/").get(getPost);
Router.route("/").put(postPicMiddleware, updatePost);
Router.route("/").delete(deletePost);
module.exports = Router;
