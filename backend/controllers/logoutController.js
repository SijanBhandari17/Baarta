const User = require('../models/userModel')

const handleLogout = async (req ,res)=> {

  try
  { 
    const cookies = req.cookies;

    if(!cookies?.refreshToken) return res.status(401).json({"error" : "no cookies found "});
    const {refreshToken} = cookies;
    const foundUser = await User.findOne({refreshToken}).exec()
    if(!foundUser) return res.status(203).json({"error" : "no user found in db with that refreshToken"});
    foundUser.refreshToken="";
    const result = await foundUser.save()
    console.log(result)
    /////////// clearing the cookie ///////////////
    res.clearCookie('refreshToken' , 
      {
        HttpOnly : true,
        sameSite : 'lax',
        maxAge : 30*24*60*60*1000
      }
    );
    res.clearCookie('accessToken', {
      HttpOnly : true,
      sameSite : 'lax',
      maxAge : 30*24*60*60*1000
    })


    res.status(201).json({"message" : "successful logout"});
  }
  catch(err)
  {
    return res.status(500).json({"error" : `${err.name}`})
  }
}

module.exports = handleLogout;