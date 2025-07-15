require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const handleNewUser = require('./routes/registerRoute');
const handleLogin = require('./routes/authRoutes');
const handleLogout = require('./routes/logoutRoutes');
const showDashBoard = require('./routes/dashboardRoute')
const postHandler = require('./routes/postRoutes')
const profilepic = require('./routes/profilePic')
const verifyJWT = require('./middleware/verifyJWT');
const cors = require('cors')
const cloudinaryMiddleware = require('./middleware/cloudinaryProfilePicMiddleware')
const corsOptions = require('./config/corsOption')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConfig')
const PORT = process.env.PORT || 5500;
connectDB()
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
// this is the part where we call in the routes with verification.
app.use('/register',handleNewUser);
app.use('/login',handleLogin);
app.use('/logout',handleLogout);
app.use('/dashboard' ,verifyJWT ) // middleware
app.use('/dashboard' , showDashBoard) 
app.use('/uploads', [verifyJWT ,cloudinaryMiddleware])  // middleware
app.use('/uploads' , profilepic)
app.use('/post' , verifyJWT)
app.use('/post' , postHandler)
mongoose.connection.once('open' , ()=>{
  console.log('connected to MongoDB atlas')
  app.listen(5000 , ()=>{
    console.log(`the server is listening to port no . ${PORT}`)
  })
})
