const Profile = require("../models/profilePicModel");
const User = require("../models/userModel");
const handleDashBoard = async (req, res) => {
  try {
    const result = await User.findOne({ email: req.user.email }).exec();
    if (!result)
      return res
        .status(400)
        .json({ error: "bad request at accessing the dashboard" });
    const profile = await Profile.findOne({ userId: result._id }).exec();
    const foundUser = await User.findOne({ email: req.user.email }).exec();
    res.status(200).json({
      messsage: `access granted`,
      info: {
        username: req.user.username,
        email: req.user.email,
        profilePic:
          profile?.profilePicLink ||
          "https://res.cloudinary.com/dlddcx3uw/image/upload/v1752323363/defaultUser_cfqyxq.svg",
        userId: result._id,
        no_of_post: foundUser.no_post,
        no_of_replies: foundUser.no_replies,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: `${err.name}` });
  }
};
module.exports = { handleDashBoard };
