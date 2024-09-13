require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const CookieParser = require('cookie-parser')
const cookieParser = require('cookie-parser')
const { checkForAuth } = require('./Middlewares/authentication')
const blogRouter = require('./routes/blog')
const Blog = require('./Models/blog')
const PORT = process.env.PORT || 8080;



mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log('data is connected')
})
.catch((e)=>{
  console.log(e)
})



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(express.static(path.resolve('./Public')))
app.use(checkForAuth)

app.use('/user',userRouter);
app.use('/blog',blogRouter);
app.get('/',async(req,res)=>{
  const Blogs = await Blog.find({});
  res.render('Home',{
    user:req.user,
    Blogs:Blogs
  })
})


app.listen(PORT,()=>{
  console.log(`server is running on PORT:${PORT}`)
})