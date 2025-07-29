require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const handleNewUser = require('./routes/registerRoute');
const handleLogin = require('./routes/authRoutes');
const handleLogout = require('./routes/logoutRoutes');
const showDashBoard = require('./routes/dashboardRoute')
const forumHandler = require('./routes/forumRoutes')
const postHandler = require('./routes/postRoutes')
const profilepic = require('./routes/profilePic')
const commentRoute = require('./routes/commentRoutes')
const replyHandler = require('./routes/replyRoutes')
const notificationHandler = require('./routes/requestRoutes')
const pollHandler = require('./routes/pollRoutes')
const allResource = require('./routes/sendAllRoutes')
const discussionHandler = require('./routes/discussionRoutes')
const verifyJWT = require('./middleware/verifyJWT');
const cors = require('cors')
const cloudinaryMiddleware = require('./middleware/cloudinaryMiddleware')
const corsOptions = require('./config/corsOption')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConfig');
const { verify } = require('jsonwebtoken');
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
app.use('/forum' , verifyJWT)
app.use('/forum' , forumHandler)
app.use('/post' , verifyJWT)
app.use('/post' , postHandler)
app.use('/comment' , verifyJWT)
app.use('/comment',  commentRoute)
app.use('/reply' ,  verifyJWT)
app.use('/reply' , replyHandler)
app.use('/notification' ,  verifyJWT)
app.use('/notification' , notificationHandler)
app.use('/poll' ,  verifyJWT)
app.use('/poll' , pollHandler)
app.use('/all',  verifyJWT)
app.use('/all', allResource)
app.use('/discussion', verifyJWT)
app.use('/discussion' , discussionHandler)

mongoose.connection.once('open' , ()=>{
  console.log('connected to MongoDB atlas')
  app.listen(5000 , '0.0.0.0' ,()=>{
    console.log(`the server is listening to port no . ${PORT}`)
  })
})
