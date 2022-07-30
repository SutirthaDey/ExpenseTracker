const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');

dotenv.config();


const authenticator = async(req,res,next)=>{
  try{
    const token = req.header('authorization');
    const userId = Number(jwt.verify(token,process.env.PRIVATE_KEY));
    
    const user = await User.findByPk(userId);

    if(!user){
        throw new Error(`User doesn't exists!`);
    }
    req.user = user;
    next();
  }
  catch(e)
  {
    res.status(401).json({sucess:false,message: e.message});
  }
}

module.exports = authenticator;