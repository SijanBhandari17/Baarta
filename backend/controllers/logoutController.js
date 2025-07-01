const User = require('../models/userModel')

const handleLogout = async (req ,res)=> {

  const cookies = req.cookies;

  if(!cookies?.jwt) return res.status(401).json({"error" : "no cookies found "});

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({refreshToken}).exec()

  if(!foundUser) return res.status(203).json({"error" : "no user found in db with that refreshToken"});

  foundUser.refreshToken="";
  const result = await foundUser.save()
  console.log(result)
  /////////// clearing the cookie ///////////////
  res.clearCookie('jwt' , 
    {
      HttpOnly : true,
      sameSite : 'none',
      maxAge : 3*24*60*60*1000
    }
  );

  //////////// updating the database /////////////

  res.status(201).json({"message" : "successful logout"});
}

module.exports = handleLogout;