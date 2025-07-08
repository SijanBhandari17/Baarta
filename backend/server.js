require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const handleNewUser = require('./routes/registerRoute');
const handleLogin = require('./routes/authRoutes');
const handleLogout = require('./routes/logoutRoutes');
const showDashBoard = require('./routes/dashboardRoute')
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
app.post('/test' , (req , res)=>{
  if(!req?.body) res.status(400).json({"error" : "body is missing"})
  console.log(`Oh! hi there ${req.body.username} and you email is ${req.body.email} btw`)
  res.status(404).json({'message' : "data insertion successful"})
})
app.use('/register',handleNewUser);
app.use('/login',handleLogin);
app.use('/logout',handleLogout);
app.use('/dashboard' ,verifyJWT )
app.use('/dashboard' , showDashBoard)
mongoose.connection.once('open' , ()=>{
  console.log('connected to MongoDB atlas')
  app.listen(PORT , ()=>{
    console.log(`the server is listening to port no . ${PORT}`)
  })
})
