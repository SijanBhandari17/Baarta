const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const pendingUser = require("../models/pendingUser");
const handleNewUser = async (req, res) => {
  if (!req?.body)
    return res.status(400).json({ error: "the request body is null" });
  const registerData = req.body;
  const user_email = registerData.email;
  const username = registerData.username;
  const password = registerData.password;
  if(!user_email || !username || !password ) return res.status(400).json({"error" : "all field ( username , email , password ) are required"});
  const replyValidatoin = formValidation(username , user_email , password)
  if(!replyValidatoin.u_email || !replyValidatoin.u_name || !replyValidatoin.u_password) return res.status(400).json({"error" : "incorrect format" , "format" : replyValidatoin})
  const foundUser = await User.findOne({email : user_email}).exec()
  if(foundUser) return res.status(409).json({"error" : "email already exists"});  // 409 - conflict
  const otp = generateOTP()
  req.user = {username : username , email : user_email , password :password , otp : otp }
  try
  {
    const alreadyExisting = await pendingUser.findOne({email: user_email}).exec()
    if(!alreadyExisting)
    {
    const hash_password = await bcrypt.hash(password,10);
    const result = await pendingUser.create({
      username: username,
      email: user_email,
      password: hash_password,
      otp: otp,
    });
  }
   
  else{
    alreadyExisting.otp = otp
    alreadyExisting.username = username
    alreadyExisting.password = await bcrypt.hash(password , 10)
    await alreadyExisting.save()
  }
  }
  catch(err)
  {
    return res.status(500).json({"error" : err.name})
  }
  // this is where node mailer works 
  let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass:process.env.NODEMAILER_PASS
  }
});

let mailOptions = {
  from: process.env.NODEMAILER_USER,
  to: user_email,
  subject: 'Your otp for login',
  text: otp
};

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  // node mailer function ended
  res.status(200).json({ message: "otp sent to your gmail account" });
  /*
  try { const hash_password = await bcrypt.hash(password,10);
  const result = await User.create({
    email : user_email,
    password : hash_password, 
    username 
  })
  res.status(200).json({"message" : "successful insertion" , "result" :result});
  } catch(err) {
    console.log("server error");
    res.sendStatus(500);
  }
*/
};
function formValidation(user_name, user_email, user_password) {
  let u_name = true;
  let u_email = true;
  let u_password = true;
  let regex = /^[^\s@]+@(gmail\.com|student\.[a-zA-Z]+\.edu\.np)$/;
  if (!regex.test(user_email)) u_email = false;
  regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!regex.test(user_password)) u_password = false;
  if (user_name.length < 8) u_name = false;
  return { u_name, u_email, u_password };
}
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = handleNewUser;

