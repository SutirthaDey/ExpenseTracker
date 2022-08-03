const ForgotPassword = require('../models/forgotpassword');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const path = require('path');
const saltRounds = 12;

exports.postForgotPassword = async(req,res,next)=>{
    try{
    const email = req.body.email;
    const user = await User.findOne({where: {email: email}});
    const response = await ForgotPassword.create({active: true})
    await response.setUser(user);
    const resetLink = `http://localhost:3000/password/resetpassword/${response.id}?userid=${user.id}`;
    res.status(200).json({resetLink});
    }
    catch(e)
    {
        res.json({e});
    }
}

exports.getResetPassword = async(req,res,next)=>{
    try{
        const id = req.params.id;
        const resetRequest = await ForgotPassword.findOne({where: {id: id}});

        if(!resetRequest || !resetRequest.active)
         throw Error('Not found!');
        
        res.sendFile(path.join(__dirname,'../public','forgotpassword.html'));
    }
    catch(e)
    {
        res.status(404).json(e);
    }
}

exports.postResetPassword = async(req,res,next)=>{
    try{
        const newPassword = req.body.password;
        const userId = req.query.userid;
        const forgotpasswordId = req.params.id;
        const user = await User.findOne({where: {id: userId}});
        const hashedPassword =  await bcrypt.hash(newPassword,saltRounds);
        await user.update({password:hashedPassword});
        
        const forgotpassword = await ForgotPassword.findOne({where:{id:forgotpasswordId}});
        await forgotpassword.update({active:false});
        res.status(200).json({success: true});
    }
    catch(e)
    {
        res.json({e});
    }
}