const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const handleLogin = async (req , res) => {
  try {
  //////////////// authentication //////////////////////
  const {email, password} = req.body;
  if(!email || !password) return res.status(400).json({"error" : "both email and password are required"});
  const foundUser = await User.findOne({email}).exec() 
  if(!foundUser) return res.sendStatus(401).json({"error" : "no such registered username found"});
  const hashedPassword = foundUser.password;
  const match = await bcrypt.compare(password , hashedPassword);
  if(!match) return res.status(401).json({"error" : "password is invalid"});
  ///////////////////// authorization part , sending access token in response and refresh token in cookies (httpOnly) , updating refreshToken in database . /////////////
  const accessToken = jwt.sign(
    {
      "email" : foundUser.email,
      "username" : foundUser.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {"expiresIn" : "30m"}
  );

  const refreshToken = jwt.sign(
    {
      "email" : foundUser.email,
      "username": foundUser.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {"expiresIn":"30d"
    }
  );

  ////////// updating refeshToken in database /////////////////
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save()
  ///////////////// setting up cookies, (key , value , {httpOnly , maxAge , sameSite : 'none'} // sameSite:"none" is important to allow cookies for cross site requests (helpful when backend and frontend are running in diffrent origin);

  res.cookie("refreshToken" , refreshToken , {
    httpOnly : true,
    sameSite : 'lax',
    maxAge : 30*24*60*60*1000
  });
  res.cookie("accessToken" , accessToken , {
    httpOnly : true,
    sameSite : 'lax',
    maxAge : 30*24*60*60*1000
  })

  ///////// sending accessToken in response body ///////////
  res.status(200).json({"message" : "successfully logged into the system"});

} catch(err) {
  console.log(`error : ${err}`);
  res.sendStatus(500); // server error
}

}

module.exports = handleLogin;