const Post = require("../models/postModel");
const Forum = require("../models/forumModel");
const User = require("../models/userModel");
const uploadToCloudinary = require("../config/uploadCloudinaryConfig");
const mongoose = require("mongoose");

const createForum = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    if (!req.body?.forumName)
      return res
        .status(400)
        .json({ error: " forumName missing in the request header" });
    if (!req.body?.descriptionText)
      return res
        .status(400)
        .json({ error: " description text missing in the request header" });
    if (!req.body?.genre)
      return res
        .status(400)
        .json({ error: "genre missing in the request header" });
    if (!req.user)
      return res.status(401).json({ error: "not aunthenticated " });

    const { forumName, descriptionText, genre } = req.body;
    const { email } = req.user;

    const foundUser = await User.findOne({ email }).session(session).exec();

    if (!foundUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "non existent user authenticated" });
    }

    const checkForForum = await Forum.findOne({ forum_name: forumName })
      .session(session)
      .exec();
    if (checkForForum) {
      await session.abortTransaction();
      return res.status(409).json({ error: "the forum name already exists" });
    }

    const result = await Forum.create(
      [
        {
          admin_id: foundUser._id,
          forum_name: forumName,
          description_text: descriptionText,
          genre: genre,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    res
      .status(201)
      .json({ message: "the forum has been created ", body: result[0] });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `hahah ${err.message}` });
  } finally {
    await session.endSession();
  }
};

const getForum = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    if (!req.user)
      return res.status(401).json({ error: "unaunthenticated user access" });

    const { email } = req.user;

    const foundUser = await User.findOne({ email }).session(session).exec();

    if (!foundUser) {
      await session.abortTransaction();
      res.status(404).json({ message: "deleted or removed user" });
    }

    const foundForums = await Forum.find({
      $or: [
        { admin_id: foundUser._id },
        { moderator_id: foundUser._id },
        { member_id: foundUser._id },
      ],
    })
      .session(session)
      .exec();
    if (!foundForums) {
      await session.abortTransaction();
      res.status(404).json({ message: "no forums joined " });
    }

    await session.commitTransaction();
    res
      .status(200)
      .json({ message: "successful retrieval", body: foundForums });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: `${err.name}` });
  } finally {
    await session.endSession();
  }
};

module.exports = { createForum, getForum };

