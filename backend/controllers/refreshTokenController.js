//////// note : if refresh token expires , the user must logout. ( also note that , cookie.maxAge is equal to refreshToken.expiresIn , so when refreshToken expires , cookie also gets expires. now , the user should login again to get access and refresh token ). //////// 

// use refesh token rotation method - Refresh token rotation is a security mechanism designed to minimize the risks associated with token theft and unauthorized use. In this process, each time a refresh token is used to acquire a new access token, a brand new refresh token is also generated and the previous one is invalidated. This strategy ensures that compromised refresh tokens lose their utility almost immediately, drastically reducing the potential for compromise. ///////
///////////// here we will be using refresh token rotation method , and implementing refresh token reuse detection //////////////
/// check the link - https://www.descope.com/blog/post/refresh-token-rotation ////////////
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const util = require('util');
const jwtVerify = util.promisify(jwt.verify);


const handleRefreshToken = async (req ,res) => {

  const cookies = req.cookies;

  if(!cookies?.jwt) return res.status(401).json({"message" : "cookie expired"});

  const refreshToken = cookies.jwt;


  const foundUser = await User.findOne({refreshToken}).exec()
  if(!foundUser) {
    console.log('no user with this refresh token !!!!! , logout the user immediately!');
    return  res.status(403).json({"error" : "no user matched with this refresh Token"});
  }

  let decoded;

  try {
    decoded = await jwtVerify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

  } catch(err) {
    console.log("refresh token is experied");
    return res.sendStatus(403);
  }

  ////////////////// create a new access and refresh token - as we are using refresh token rotation method , if we were not using this method , we might be only generating the access token and send it as response . 

  newAccessToken = jwt.sign(
    {
      email : foundUser.email,
      username : foundUser.username,
      user_roles : foundUser.user_roles
    },
    process.env.ACCESS_TOKEN_SECRET,
    {"expiresIn" : "20m"}
  );

  newRefreshToken = jwt.sign(
    {
      email : foundUser.email,
      username : foundUser.username,
      user_roles : foundUser.user_roles
    },
    process.env.REFRESH_TOKEN_SECRET,
    {"expiresIn" : "30d"}
  );

  foundUser.refreshToken = newRefreshToken;
  const result = await foundUser.save()
  console.log(result)
  try {
  res.cookie(
    "jwt" ,
    newRefreshToken,
    {
      httpOnly : true,
      sameSite : 'none',
      maxAge : 3*24*60*60*1000
    }
  );

  res.status(200).json({"accessToken": newAccessToken});


} catch(err) {
  console.log(`error : ${err}`);
  res.sendStatus(500);
}

}

module.exports = handleRefreshToken;