const Post = require("../models/postModel");
const User = require("../models/userModel");
const Forum = require("../models/forumModel");
const Comment = require("../models/commentModel");
const Profile = require("../models/profilePicModel");
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
    if (req.files?.postImage) {
      const file = req.files.postImage[0];
      const publicId = `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`;
      const result = await uploadToCloudinary(file.buffer, {
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

const updatePost = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    if (!req.body?.postId)
      return res
        .status(400)
        .json({ error: "forumId is missing the request header" });
    if (!req.user?.email)
      return res
        .status(401)
        .json({ error: "unaunthenticated user send the request" });

    const { title, content_text, location, genre, postId } = req.body;

    const { email } = req.user;

    const foundUser = await User.findOne({ email }).session(session).exec();
    if (!foundUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "the user has not been found" });
    }

    const foundPost = await Post.findOne({ _id: postId })
      .session(session)
      .exec();
    if (!foundPost) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "the forum is either deleted or removed" });
    }

    if (foundUser._id.toString() !== foundPost.author_id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ error: "unauthorized request sent" });
    }
    let imgSrc = "";
    if (req.files?.postImage) {
      const file = req.files.postImage[0];
      const publicId = `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`;
      const result = await uploadToCloudinary(file.buffer, {
        public_id: publicId,
        folder: "uploads",
        resource_type: "auto",
      });

      imgSrc = result.secure_url;
    }

    foundPost.title = title || foundPost.title;
    foundPost.content.text = content_text || foundPost.content.text;
    foundPost.content.location = location || foundPost.content.location;
    foundPost.content.image = imgSrc || foundPost.content.image;
    foundPost.genre = genre || foundPost.genre;

    const result = await foundPost.save({ session });

    await session.commitTransaction();

    res
      .status(201)
      .json({ message: "the post has been updated", body: result });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `${err.message}` });
  } finally {
    await session.endSession();
  }
};

const deletePost = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    if (!req.body?.postId)
      return res
        .status(400)
        .json({ error: "forumId is missing the request header" });
    if (!req.user?.email)
      return res
        .status(401)
        .json({ error: "unaunthenticated user send the request" });

    const { postId } = req.body;
    const { email } = req.user;

    const foundUser = await User.findOne({ email }).session(session).exec();
    if (!foundUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "the user has not been found" });
    }

    const foundPost = await Post.findOne({ _id: postId })
      .session(session)
      .exec();
    if (!foundPost) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "the forum is either deleted or removed" });
    }

    if (foundUser._id.toString() !== foundPost.author_id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ error: "unauthorized request sent" });
    }

    await Forum.updateOne(
      { _id: foundPost.parent_forum },
      { $pull: { post_id: foundPost._id } },
      { session },
    );

    const foundCommentArr = await Comment.find({
      "parent.parent_id": foundPost._id,
    })
      .session(session)
      .exec();

    const result = await Post.deleteOne({ _id: foundPost._id }, { session });

    if (foundCommentArr.length === 0) {
      await session.commitTransaction();
      return res.status(201).json({
        message: "the post has been successfully deleted",
        body: result,
      });
    }

    await Comment.deleteMany(
      { "parent.parent_id": foundPost._id },
      { session },
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "the post has been successfully deleted",
      body: result,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ err: `${err.message}` });
  } finally {
    await session.endSession();
  }
};

const getPost = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    if (!req.query?.forumId)
      return res
        .status(400)
        .json({ error: "forum id missing in the query header" });

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
    const toSendPostBody = await Promise.all(
      foundPostArr.map(async (item) => {
        const postUploader = await User.findOne({ _id: item.author_id })
          .session(session)
          .exec();
        const postUploaderProfilePic = await Profile.findOne({
          userId: postUploader?._id,
        })
          .session(session)
          .exec();

        const toReturnObject = {
          ...item.toObject(),
          authorName: postUploader?.username || "[deleted user]",
          authorEmail: postUploader?.email || "[deleted user]",
          authorProfilePic:
            postUploaderProfilePic?.profilePicLink ||
            "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg",
        };
        return toReturnObject;
      }),
    );

    await session.commitTransaction();

    res.status(200).json({
      message: "successfully recovered the comments from the given post",
      body: toSendPostBody,
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `${err.message}` });
  } finally {
    await session.endSession();
  }
};
module.exports = { uploadPost, getPost, updatePost, deletePost };
