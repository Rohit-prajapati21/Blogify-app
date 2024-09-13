const {Router} = require('express');
const router = Router();
const multer = require('multer');
const path = require('path')
const Blog = require('../Models/blog');
const Comment = require('../Models/Comment')

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    console.log("Destination path:", path.resolve('./Public/uploads'));
    cb(null,path.resolve('./Public/uploads'))
  },
  filename:function(req,file,cb){
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null,fileName);
  }
})
const upload = multer({storage:storage});
router.get('/:id',async(req,res)=>{
  const singleBlog= await Blog.findById(req.params.id).populate('createdBy');
 const comments = await Comment.find({blogId:req.params.id}).populate("createdBy")
 return res.render('Blog',{
  user:req.user,
  singleBlog,
  comments
 })
})

router.post('/comment/:blogId',async(req,res)=>{
  await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user.id
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})

router.get('/add-new',(req,res)=>{
  res.render('addBlog',{
    user:req.user
  });
})

router.post('/add-new',upload.single("coverImg"),async(req,res)=>{
  const {title,body} = req.body;

const blog = await Blog.create({
  title,
  body,
  coverImage:`/uploads/${req.file.filename}`,
  createdBy:req.user.id,
});

})
module.exports = router;