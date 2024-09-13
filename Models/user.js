const {Schema,model} = require('mongoose');
const { error } = require('node:console');

const {createHmac,randomBytes} = require('node:crypto');
const { genrateToken } = require('../Service/authentication');

const userSchema = new Schema({
  fullName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  salt:{
    type:String,
   
  },
  password:{
    type:String,
    required:true,
  },
  profileImage:{
    type:String,
    default:"/Images/User-Avatar-in-Suit-PNG.png",
  },
  role:{
    type:String,
    enum:["USER","ADMIN"],
    default:"USER",
  }
},{timestamps:true});


userSchema.pre("save", function(next){
  const user =this;
  if(!user.isModified("password")) return;

  const salt = randomBytes(16).toString()
  const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");
  this.salt =salt;
  this.password = hashedPassword;
  next();
})


userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email: email });
  if (!user) throw new Error("user not found");

  const salt = user.salt;
  const hashedPassword = user.password;

  console.log("Salt from DB:", salt);
  console.log("Hashed password from DB:", hashedPassword);

  const userhashed = createHmac("sha256", salt).update(password).digest("hex");

  console.log("Hashed input password:", userhashed);

  if (userhashed !== hashedPassword) throw new Error("incorrect password");
  const token = genrateToken(user);
  return token;
});







const User = model('user',userSchema);

module.exports = User;