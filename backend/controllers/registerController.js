const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const handleNewUser = async (req ,res)=> {
  if(!req?.body) return res.status(400).json({"error" : "the request body is null"})
  const registerData = req.body
  const user_email = registerData.email;
  const username = registerData.username;
  const password = registerData.password;
  // const user_roles = registerData.user_roles; user names are to be inserted by defulat as just users later on 
  //// in this code now i will do form validation 
  if(!user_email || !username || !password ) return res.status(400).json({"error" : "all field ( username , email , password ) are required"});
  const replyValidatoin = formValidation(username , user_email , password)
  if(!replyValidatoin.u_email || !replyValidatoin.u_name || !replyValidatoin.u_password) return res.status(400).json({"error" : "incorrect format" , "format" : replyValidatoin})
  ///////////////////////////////////
  // checking email already exists or not 
  const foundUser = await User.findOne({email : user_email}).exec()
  if(foundUser) return res.status(409).json({"error" : "email already exists"});  // 409 - conflict
  /////////// code for sending verification emails ///////    - not done yet ( will be done soon !)
  ////// hashing the password and storing the user data into the database //////
  try {
  const hash_password = await bcrypt.hash(password,10);
  const result = await User.create({
    email : user_email,
    password , 
    username 
  })
  res.status(200).json({"message" : "successful insertion" , "result" :result});
  } catch(err) {
    console.log("server error");
    res.sendStatus(500);
  }

}
function formValidation(user_name , user_email , user_password){
  let u_name = true
  let u_email = true
  let u_password = true
  let regex = /^[^\s@]+@(gmail\.com|email\.com|ymail\.com)$/
  if(!regex.test(user_email)) u_email = false
  regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
  if(!regex.test(user_password)) u_password = false
  if(user_name.length < 8) u_name = false
  return {u_name , u_email , u_password}
}

module.exports = handleNewUser;