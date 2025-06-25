const userDB = {
  users : require('../models/User.json'),
  setUser : function (data) { this.users = data}
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req , res , next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization ; // contains scheme and credentials saperated by a single space 

  if(!authHeader) return res.sendStatus(401);

  [scheme , credential] = authHeader.split(' ');

  if(!scheme || !credential) return res.sendStatus(400);

  switch(scheme) {
    case 'Bearer':
      console.log('Bearer');
      jwt.verify(
        credential,
        process.env.ACCESS_TOKEN_SECRET,
        (err , decoded)=>{
          if(err) return res.sendStatus(403);

          ///////// handling valid jwt token /////////
          console.log('token is verified');
          req.user = {
            email : decoded.email,
            user_roles : decoded.user_roles
          }
          next();
        }
      );
    break;
  case 'Basic':
    console.log("Basic");
    return res.status(400).json({"error" : "only accepts Bearer"});
    break;
  default:
   return res.status(400).json({"error" : "only accepts Bearer"});
  }
}

module.exports = verifyJWT;