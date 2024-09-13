const { validateToken } = require("../Service/authentication");



function checkForAuth(req,res,next){
const {token} = req.cookies;
if(!token){
 return next();
}
try{
  const userPayload = validateToken(token);
  req.user = userPayload;
 
} catch(e){}
 return next();

}


module.exports = {
  checkForAuth
}