const jwt  = require('jsonwebtoken');
const secret = '#@super30'


function genrateToken(user){
  const payload = {
    id:user._id,
    email:user.email,
    role:user.role
  };

  const token =  jwt.sign(payload,secret);
  return token;
}


function validateToken(token){
  const payload = jwt.verify(token,secret);
  return payload;
}


module.exports = {
  genrateToken,
  validateToken
}