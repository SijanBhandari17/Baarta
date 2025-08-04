const Notification = require("../models/inviteNotificationModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Profile = require("../models/profilePicModel");
const Forum = require("../models/forumModel");
const Poll = require("../models/pollModel");
const Discussion = require("../models/discussionModel");
const mongoose = require("mongoose");

const postDiscussion = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    if (!req.body?.forumId)
      return res
        .status(400)
        .json({ error: "missing forumId in the request header" });
    if (!req.body?.title)
      return res
        .status(400)
        .json({ error: "missing title in the request header" });
    if (!req.body?.description)
      return res
        .status(400)
        .json({ error: "missing description in the request header" });
    if (!req.body?.end_date)
      return res
        .status(400)
        .json({ error: "missing end_date in the request header" });

    const { forumId, title, description, end_date } = req.body;

    if (!req.user?.email)
      return res
        .status(400)
        .json({ error: "unauthenticated user sent the request" });

    const { email } = req.user;

    const foundUser = await User.findOne({ email }).session(session).exec();
    if (!foundUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "user not found" });
    }

    const foundForum = await Forum.findOne({ _id: forumId })
      .session(session)
      .exec();
    if (!foundForum) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "the forum is either deleted or removed" });
    }

    if (
      !foundForum.member_id.includes(foundUser._id) &&
      !foundForum.moderator_id.includes(foundUser._id) &&
      foundForum.admin_id.toString() !== foundUser._id.toString()
    ) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({
          error: "you need to be a part of the forum to add a discussion",
        });
    }

    const duplicateDiscussion = await Discussion.findOne({ title })
      .session(session)
      .exec();
    if (duplicateDiscussion) {
      await session.abortTransaction();
      return res
        .status(409)
        .json({
          error: "same discussion with the same title has been uploaded",
        });
    }

    const createdDiscussion = await Discussion.create(
      [
        {
          forum_id: forumId,
          author_id: foundUser._id,
          title: title,
          description: description,
          end_date: end_date,
        },
      ],
      { session },
    );

    const foundProfilePicture = await Profile.findOne({ userId: foundUser._id })
      .session(session)
      .exec();

    const toSendResult = {
      ...createdDiscussion[0].toObject(),
      authorName: foundUser.username,
      authorEmail: foundUser.email,
      authorProfilePicLink:
        foundProfilePicture?.profilePicLink ||
        "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg",
    };

    await session.commitTransaction();

    return res
      .status(201)
      .json({
        message: "successful created of the discussion",
        body: toSendResult,
      });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: `${err.stack}` });
  } finally {
    await session.endSession();
  }
};

const deleteDiscussion = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    if (!req.body?.discussionId)
      return res
        .status(400)
        .json({ error: "missing discussionId in the request header" });

    const { discussionId } = req.body;

    if (!req.user?.email)
      return res
        .status(400)
        .json({ error: "unauthenticated user sent the request" });

    const { email } = req.user;

    const foundUser = await User.findOne({ email }).session(session).exec();
    if (!foundUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "user not found" });
    }

    const foundDiscussion = await Discussion.findOne({ _id: discussionId })
      .session(session)
      .exec();
    if (!foundDiscussion) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "the forum is either deleted or removed" });
    }

    if (foundDiscussion.author_id.toString() !== foundUser._id.toString()) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ error: "only the author can deleted the forum" });
    }

    const result = await Discussion.deleteOne(
      { _id: foundDiscussion._id },
      { session },
    );

    await session.commitTransaction();

    return res
      .status(201)
      .json({ message: "successful deletion of the discussion", body: result });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: `${err.stack}` });
  } finally {
    await session.endSession();
  }
};

const getDiscussion = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    if (!req.query?.forumId)
      return res
        .status(400)
        .json({ error: "missing forumId in the request header" });

    const { forumId } = req.query;

    if (!req.user?.email)
      return res
        .status(400)
        .json({ error: "unauthenticated user sent the request" });

    const { email } = req.user;

    const foundUser = await User.findOne({ email }).session(session).exec();
    if (!foundUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "user not found" });
    }

    const foundForum = await Forum.findOne({ _id: forumId })
      .session(session)
      .exec();
    if (!foundForum) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "the forum is either deleted or removed" });
    }

    const discussionArr = foundForum.discussion_id.map((item) =>
      item.toString(),
    );

    const foundDiscussionArr = await Discussion.find({
      _id: { $in: discussionArr },
    })
      .session(session)
      .exec();

    const toSendBody = await Promise.all(
      foundDiscussionArr.map(async (item) => {
        const authorId = await User.findOne({ _id: item.author_id })
          .session(session)
          .exec();
        const authorProfilePic = await Profile.findOne({ userId: authorId._id })
          .session(session)
          .exec();

        return {
          ...item.toObject(),
          authorName: authorId.username,
          authorEmail: authorId.email,
          authorProfilePicLink:
            authorProfilePic?.profilePicLink ||
            "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg",
        };
      }),
    );

    await session.commitTransaction();

    res
      .status(201)
      .json({
        message: "successful deletion of the discussion",
        body: toSendBody,
      });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `${err.stack}` });
  } finally {
    await session.endSession();
  }
};

module.exports = { postDiscussion, deleteDiscussion, getDiscussion };
