require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const handleNewUser = require('./routes/registerRoute');
const handleLogin = require('./routes/authRoutes');
const handleRefreshToken = require('./routes/refreshTokenRoutes');
const handleLogout = require('./routes/logoutRoutes');
const verifyJWT = require('./middleware/verifyJWT');
const cors = require('cors')
const corsOptions = require('./config/corsOption')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConfig')
const PORT = process.env.PORT || 5500;
connectDB()
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());

app.use('/register',handleNewUser);
app.use('/login',handleLogin);
app.use('/refresh',handleRefreshToken);
app.use('/logout',handleLogout);


/////////// testing : verifyJWT ///////////////
/////// use verifyJWT ,where routes that should only be accessible to authenticated users with a valid JWT (JSON Web Token).////////

app.get('/dashboard' , verifyJWT , (req ,res)=>{   
  res.json({"message" : "welcome to the dashboard"});
})
mongoose.connection.once('open' , ()=>{
  console.log('connected to MongoDB atlas')
  app.listen(PORT , ()=>{
    console.log(`the server is listening to port no . ${PORT}`)
  })
})
