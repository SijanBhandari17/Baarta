const userDB = {
  users : require('../models/User.json'),
  setUser : function (data) { this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req ,res)=> {

  const cookies = req.cookies;

  if(!cookies?.jwt) return res.status(401).json({"error" : "no cookies found "});

  const refreshToken = cookies.jwt;

  const foundUser = userDB.users.find(person=>person.refreshToken === refreshToken);

  if(!foundUser) return res.status(203).json({"error" : "no user found in db with that refreshToken"});

  foundUser.refreshToken="";

  /////////// clearing the cookie ///////////////
  res.clearCookie('jwt' , 
    {
      HttpOnly : true,
      sameSite : 'none',
      maxAge : 3*24*60*60*1000
    }
  );

  //////////// updating the database /////////////

  const otherUsers = userDB.users.filter(person=>person.email !== foundUser.email);
  userDB.setUser([...otherUsers , foundUser]);

  try {
    await fsPromises.writeFile(
      path.join(__dirname , ".." , "models" , "User.json"),
      JSON.stringify(userDB.users)
    );
  } catch(err) {
    console.log("error in writing in User.json file");
    res.sendStatus(500);
  }
  res.sendStatus(204);
}

module.exports = handleLogout;