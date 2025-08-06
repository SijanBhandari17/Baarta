require("dotenv").config();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const verifyAsync = util.promisify(jwt.verify);
const verifyJWT = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies) return res.status(401).json({ error: "yes session expired" });
  const { accessToken } = cookies;
  if (!accessToken)
    return res
      .status(401)
      .json({ error: "this is all we know session expired" });
  let decoded;
  try {
    decoded = await verifyAsync(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = { email: decoded.email, username: decoded.username };
    return next();
    // i also need to make it so that req.user = decoded.email or whatever. IMPORTANT
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // this is where the refresh token stuff is gonna happen
      console.log("i think access token has expired after 30min");
      const { refreshToken } = cookies;
      if (!refreshToken)
        return res.status(401).json({ message: "cookie expired" });
      const foundUser = await User.findOne({ refreshToken }).exec();
      if (!foundUser)
        return res.status(401).json({
          error:
            "no user matched with this refresh Token or the user logged into another system",
        });
      let refreshDecoded;
      try {
        refreshDecoded = await verifyAsync(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        );
      } catch (errRefresh) {
        console.log("refreshToken error ", errRefresh);
        return res.status(401).json({ error: "invalid refresh token too" });
      }
      const newAccessToken = jwt.sign(
        {
          email: foundUser.email,
          username: foundUser.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" },
      );
      const newRefreshToken = jwt.sign(
        {
          email: foundUser.email,
          username: foundUser.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" },
      );
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        // sameSite : 'Lax',
        // secure : false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        // sameSite : 'Lax',
        // secure : false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      foundUser.refreshToken = newRefreshToken;
      const result = await foundUser.save();
      req.user = { email: foundUser.email, username: foundUser.username };
      return next();
    } else return res.status(500).json({ error: err.name });
  }
};

module.exports = verifyJWT;

