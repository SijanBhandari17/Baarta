const Profile = require("../models/profilePicModel");
const User = require("../models/userModel");
const uploadToCloudinary = require("../config/uploadCloudinaryConfig");
const handleProfilePic = async (req, res) => {
  try {
    if (!req?.files || !req?.files?.profilePic) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }
    const file = req.files.profilePic[0];

    const publicId = `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`;
    const result = await uploadToCloudinary(file.buffer, {
      public_id: publicId,
      folder: "uploads",
      resource_type: "auto",
    });
    const user = await User.findOne({ email: req.user.email }).exec();
    if (!user) return res.status(401).json({ error: "bad email recieved" });
    const existingProfile = await Profile.findOne({ userId: user._id });
    if (!existingProfile) {
      const userId = user._id;
      const resultDB = await Profile.create({
        userId: userId,
        profilePicLink: result.secure_url,
      });
      console.log("result", resultDB);
      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          public_id: result.public_id,
          url: result.secure_url,
          original_filename: file.originalname,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          created_at: result.created_at,
          type: result.resource_type,
        },
      });
    } else {
      existingProfile.profilePicLink = result.secure_url;
      await existingProfile.save();
      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          public_id: result.public_id,
          url: result.secure_url,
          original_filename: file.originalname,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          created_at: result.created_at,
          type: result.resource_type,
        },
      });
    }
  } catch (err) {
    console.error("Upload error: ", err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = handleProfilePic;
