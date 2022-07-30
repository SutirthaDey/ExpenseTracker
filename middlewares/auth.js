const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

dotenv.config();

exports.authenticator = async(req,res,next)=>{
  try{
    const token = req.header('authorization');
    const userId = jwt.verify(token,process.env.PRIVATE_KEY);
    const user = await User.findByPk(userId);
    if(!user){
        throw new Error(`User doesn't exists!`);
    }

    console.log(user);
    req.user = user;
    next();
  }
  catch(e)
  {
    return res.status(401).json({sucess:false,message: e.message});
  }
}