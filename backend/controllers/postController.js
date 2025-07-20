const Post = require("../models/postModel");
const User = require("../models/userModel");
const Forum = require("../models/forumModel");
const uploadToCloudinary = require("../config/uploadCloudinaryConfig");
const mongoose = require("mongoose");
const uploadPost = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    if (!req.body?.forumId)
      return res
        .status(400)
        .json({ error: "forumId missing in the request header" });
    if (!req.body?.title)
      return res
        .status(400)
        .json({ error: "title missing in the request header" });
    if (!req.body?.content_text)
      return res
        .status(400)
        .json({ error: "content text missing in the request header" });
    if (!req.body?.genre)
      return res
        .status(400)
        .json({ error: "genre missing in the request header" });
    const userEmail = req.user?.email;
    const { forumId, title, content_text, genre } = req.body;
    if (!userEmail)
      return res
        .status(400)
        .json({ error: "email missing in the request header" });
    const foundUser = await User.findOne({ email: userEmail })
      .session(session)
      .exec();
    if (!foundUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "no user with such email found" });
    }
    const allowed_genre = ["Question", "Announcement", "Event"];
    if (allowed_genre.indexOf(genre) === -1) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ error: "the genre isn't even in teh list" });
    }

    let imgSrc = "";
    if (req.file) {
      const publicId = `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, "")}`;
      const result = await uploadToCloudinary(req.file.buffer, {
        public_id: publicId,
        folder: "uploads",
        resource_type: "auto",
      });

      imgSrc = result.secure_url;
    }
    const result = await Post.create(
      [
        {
          parent_forum: forumId,
          title: title,
          content: {
            parent_forum: forumId,
            text: content_text,
            location: req.body.location || null,
            image: imgSrc || null,
          },
          author_id: foundUser._id,
          genre: genre,
        },
      ],
      { session },
    );

    const foundForum = await Forum.findOne({ _id: forumId })
      .session(session)
      .exec();
    if (!foundForum) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "the forum does not exist or is deleted " });
    }

    foundForum.post_id = [...foundForum.post_id, result[0]._id];
    await foundForum.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      message: "success post insetion",
      body: result,
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `${err.message}` });
  } finally {
    await session.endSession();
  }
};

const deletePost = async (req, res) => {};

const getPost = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    if (!req.query?.forumId)
      return res
        .status(400)
        .json({ error: "forum id missing in the request header" });

    const { forumId } = req.query;

    // const foundForum = await Forum.findOne({_id : forumId}).session(session).exec()
    // if(!foundForum)
    // {
    //     await session.abortTransaction()
    //     return res.status(404).json({"err" : "the forum has either been deleted or is not longer existenet"})
    // }

    // const postArr = foundForum.post_id

    const foundPostArr = await Post.find({ parent_forum: forumId }).session(
      session,
    );

    await session.commitTransaction();

    res.status(200).json({
      message: "successfully recovered the comments from the given post",
      body: foundPostArr,
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `${err.message}` });
  } finally {
    await session.endSession();
  }
};
function checkForMisses(req) {
  const title = req.body.title;
  const content_text = req.body.content_text;
  const genre = req.body.genre;
  return { title, content_text, genre };
}
module.exports = { uploadPost, getPost };

