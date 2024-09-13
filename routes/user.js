const {Router} = require('express');
const router = Router();
const User = require('../Models/user')

router.get('/signup',(req,res)=>{
  res.render('Signup')
})
router.get('/signin',(req,res)=>{
  res.render('Signin')
})


router.post('/signup', async(req,res)=>{
  const {fullName,email,password} = req.body;

  const user = await User.create({
    fullName,
    email,
    password
  });

  return res.redirect('/')
})

router.post('/signin',async(req,res)=>{
  try{
   const {email,password} = req.body;
   const token  = await User.matchPassword(email,password);
   
   return res.cookie('token',token).redirect('/')
  } catch(error){
    return res.render('signin',{
      error:'Incorrect Email or Password'
    })
  }
})



router.get('/logout',(req,res)=>{
  res.clearCookie('token');
  return res.redirect('/')
})




module.exports = router;