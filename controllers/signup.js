const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

function createToken(id){
    return jwt.sign(id,process.env.PRIVATE_KEY);
}

exports.postSignUp = async(req,res,next)=>{
    const userData = req.body;
    const ExistingUser = await User.findOne({
        where: { email: userData.email}
    });

    if(ExistingUser){
        res.status(400).json({status: 'Already exists!'});
        return;
    }
    const hashedPassword =  await bcrypt.hash(userData.password,saltRounds);
    const userCreated = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phoneNumber: userData.phone
    })
    res.status(200).json({success:true})
};

exports.postLogIn = async (req,res,next)=>{
    const {email,password} = req.body;
    
    try{
        const user = await User.findOne({where:{email: email}});
        if(!user){
         throw new Error('Wrong Email id!');
        }
        const isPasswordMatched = await bcrypt.compare(password,user.password);
        if(!isPasswordMatched){
         throw new Error('Wrong password!');
        }
        const jwtToken = createToken(user.email);
        res.status(200).json({token: jwtToken, email: user.email, success: true});
    }
    catch(e){
        if(e.message === 'Wrong Email id!'){
            res.status(404).json({message: e.message, success: false});
            return;
        }
        res.status(401).json({message: e.message, success: false});
    }
}