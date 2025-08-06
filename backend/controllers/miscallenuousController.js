const Notification = require("../models/inviteNotificationModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Profile = require("../models/profilePicModel");
const Forum = require("../models/forumModel");
const mongoose = require("mongoose");

const getForumWithRequest = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    if (!req.user?.email)
      return res.status(400).json({ error: "unauthenticated request sent" });

    const { email } = req.user;

    const foundUser = await User.findOne({ email }).session(session).exec();
    if (!foundUser) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "the user account was either deleted or removed" });
    }

    const foundForums = await Forum.find({
      $or: [{ admin_id: foundUser._id }, { moderator_id: foundUser._id }],
    });

    const foundForumId = foundForums.map((item) => item._id);

    const foundForumsWithJoinRequest = await Notification.find({
      forum: { $in: foundForumId },
      type: "join_request",
    })
      .session(session)
      .exec();

    const toSendArr = await Promise.all(
      foundForumsWithJoinRequest.map(async (item) => {
        const { forum, fromUser } = item;
        const thisForum = await Forum.findOne({ _id: forum })
          .session(session)
          .exec();
        const thisUser = await User.findOne({ _id: fromUser._id })
          .session(session)
          .exec();
        const thisUserProfile = await Profile.findOne({ userId: thisUser._id })
          .session(session)
          .exec();

        const toReturnObj = {
          ...item.toObject(),
          fromUserName: thisUser.username,
          forumName: thisForum.forum_name,
          fromUserProfilePicLink:
            thisUserProfile?.profilePicLink ||
            "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg",
        };

        return toReturnObj;
      }),
    );

    await session.commitTransaction();
    res.status(200).json({
      message: "successful retrieval of forums joined",
      body: toSendArr,
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `${err.stack}` });
  } finally {
    await session.endSession();
  }
};
const getThreadsByMe = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    if (!req.user?.email)
      return res.status(400).json({ error: "unauthenticated request sent" });

    const { email } = req.user;

    const foundUser = await User.findOne({ email }).session(session).exec();

    if (!foundUser) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "the user account was either deleted or removed" });
    }
    const foundPosts = await Post.find({ author_id: foundUser._id }).session(
      session,
    );

    const postWithForums = await Promise.all(
      foundPosts.map(async (post) => {
        const forum = await Forum.findOne({ _id: post.parent_forum }).session(
          session,
        );
        return { ...post.toObject(), forum };
      }),
    );

    const profilePic = await Profile.findOne({ userId: foundUser._id })
      .session(session)
      .exec();

    const toSendBody = postWithForums.map((item) => {
      return {
        ...item,
        authorName: foundUser.username,
        profilePicLink:
          profilePic?.profilePicLink ||
          "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg",
      };
    });

    await session.commitTransaction();
    res.status(200).json({
      message: "successful retrieval of threads created",
      body: toSendBody,
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `${err.stack}` });
  } finally {
    await session.endSession();
  }
};

const getMemberNotModerator = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    if (!req.user?.email)
      return res.status(401).json({ error: "unauthenticated request sent" });
    if (!req.query?.userId)
      return res.status(400).json({ error: "userID missing in the query" });

    const { email } = req.user;
    const { userId } = req.query;

    const foundUser = await User.findOne({ email }).session(session).exec();
    if (!foundUser) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "the user account was either deleted or removed" });
    }

    const foundThatUser = await User.findOne({ _id: userId })
      .session(session)
      .exec();
    if (!foundThatUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "the target user wasn't found" });
    }

    const foundThatNotification = await Notification.findOne({
      type: "promote_to_moderator",
      toUser: foundThatUser._id,
    })
      .session(session)
      .exec();
    if (foundThatNotification) {
      await session.commitTransaction();
      return res.sendStatus(204);
    }

    const foundUserProfile = await Profile.findOne({
      userId: foundThatUser._id,
    })
      .session(session)
      .exec();

    const toSendBody = {
      ...foundThatUser.toObject(),
      userProfilePicLink:
        foundUserProfile?.profilePicLink ||
        "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg",
    };

    await session.commitTransaction();

    res.status(200).json({
      message: "successful retreival of user that is not to be moderator",
      body: toSendBody,
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ error: `${err.stack}` });
  } finally {
    await session.endSession();
  }
};

module.exports = { getForumWithRequest, getThreadsByMe, getMemberNotModerator };
