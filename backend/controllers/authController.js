const userDB = {
  users : require('../models/User.json'),
  setUser : function (data) { this.users = data}
}

const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
require('dotenv').config();


const handleLogin = async (req , res) => {
  try {
  //////////////// authentication //////////////////////
  const {email, password} = req.body;

  if(!email || !password) return res.status(400).json({"error" : "both email and password are required"});

  const foundUser = userDB.users.find(person => person.email === email);

  if(!foundUser) return res.sendStatus(401);

  const hashedPassword = foundUser.password;

  const match = await bcrypt.compare(password , hashedPassword);

  if(!match) return res.status(401).json({"error" : "password is invalid"});

  console.log("password is verified for :" , foundUser.username);

  const otherUsers = userDB.users.filter(person=>person.email !== email);

  ///////////////////// authorization part , sending access token in response and refresh token in cookies (httpOnly) , updating refreshToken in database . /////////////
  const accessToken = jwt.sign(
    {
      "email" : foundUser.email,
      "username" : foundUser.username,
      "user_roles" : foundUser.user_roles
    },
    process.env.ACCESS_TOKEN_SECRET,
    {"expiresIn" : "20m"}
  );

  const refreshToken = jwt.sign(
    {
      "email" : foundUser.email,
      "username": foundUser.username,
      "user_roles" : foundUser.user_roles
    },
    process.env.REFRESH_TOKEN_SECRET,
    {"expiresIn":"30d"}
  );

  ////////// updating refeshToken in database /////////////////
  foundUser.refreshToken = refreshToken;
  userDB.setUser([...otherUsers , foundUser]);

  await fsPromises.writeFile(
    path.join(__dirname , ".." , "models" ,"User.json"),
    JSON.stringify(userDB.users)
  );

  ///////////////// setting up cookies, (key , value , {httpOnly , maxAge , sameSite : 'none'} // sameSite:"none" is important to allow cookies for cross site requests (helpful when backend and frontend are running in diffrent origin);

  res.cookie("jwt" , refreshToken , {
    httpOnly : true,
    sameSite : 'none',
    maxAge : 30*24*60*60*1000
  });

  ///////// sending accessToken in response body ///////////
  res.status(200).json({accessToken});

} catch(err) {
  console.log(`error : ${err}`);
  res.sendStatus(500); // server error
}

}