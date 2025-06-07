const userDB = {
  users : "../models/User.json",
  setUser : function (data) { this.users = data}
}

const ROLES_LIST = require('../config/roles_list');

/////////////////// here i am creating a middleware factory ( or also known as higher-order function ) ///////////////////////

const verifyRoles = (...allowedRoles)=> {
  return (req,  res , next) =>{
  const user = req.user;

  if(!user) { console.log("no user property in req method"); return res.sendStatus(500); };

  const allowedArray = [...allowedRoles];
  const roles = Object.values(user.user_roles);

  const hasAccess = roles.map(role=>allowedArray.includes(role)).find(val=>val==true);

  if(!hasAccess) res.sendStatus(401);

  ///////////// access Granted /////////
  next();

  }

}

module.exports = verifyRoles;

/////// you can call it now ,  eg : verifyRoles('admin' , 'moderator'); , it gives permit iff the user is admin or moderator 
