const userDB = {
  users : "../models/User.json",
  setUser : function (data) { this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req ,res)=> {
  const registerData = req.body;

  if(!registerData) return res.status(400).json({"error" : "request body is null"});

  const user_email = registerData.email;
  const username = registerData.username;
  const password = registerData.password;
  const user_roles = registerData.user_roles;
  
  /////////// email validation should be done by frontend //////////
  if(!user_email || !username || !password || !user_roles) return res.status(400).json({"error" : "all field ( username , email , password , user_roles) are required"});

  // checking email already exists or not 
  const foundUser =userDB.users.find(person=> person.email ===user_email);
  if(foundUser) return res.status(409).json({"error" : "email already exists"});  // 409 - conflict

  /////////// code for sending verification emails ///////    - not done yet ( will be done soon !)

  ///////

  ////// hashing the password and storing the user data into the database //////
  try {
  const hash_password = await bcrypt.hash(password,10);
  const newUser =   {
    "email": user_email,
    "password": hash_password,
    "username": username,
    "no_post": 0,
    "no_replies": 0,
    "forum_id": [],
    "forum_request_id": [],
    "profile_id": "",
    "refreshToken": "",
    "user_roles": user_roles
  };

  userDB.setUser([...otherUsers ,newUser]);

  await fsPromises.writeFile(
    path.join(__dirname , ".." , "models" , "User.json"),
    JSON.stringify(userDB.users)
  );
  res.sendStatus(200);
  } catch(err) {
    console.log("server error");
    res.sendStatus(500);
  }

}

module.exports = handleNewUser;