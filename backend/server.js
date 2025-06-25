const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const handleNewUser = require('./routes/registerRoute');
const handleLogin = require('./routes/authRoutes');
const handleRefreshToken = require('./routes/refreshTokenRoutes');
const handleLogout = require('./routes/logoutRoutes');
const verifyRoles = require('./middleware/authorization');
const verifyJWT = require('./middleware/verifyJWT');

const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cookieParser());

app.use('/register',handleNewUser);
app.use('/login',handleLogin);
app.use('/refresh',handleRefreshToken);
app.use('/logout',handleLogout);

app.get('/' , (req ,res)=>{
  res.send('hello world');
});

/////////// testing : verifyJWT ///////////////
/////// use verifyJWT ,where routes that should only be accessible to authenticated users with a valid JWT (JSON Web Token).////////

app.get('/dashboard' , verifyJWT , (req ,res)=>{   
  res.json({"message" : "welcome to the dashboard"});
})

app.listen(PORT , ()=>{console.log(`app is running on port : ${PORT}`)});
