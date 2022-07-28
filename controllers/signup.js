const Sequelize = require('sequelize');
const User = require('../models/user');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const saltRounds = 12;

exports.postSignUp = async(req,res,next)=>{
    const userData = req.body;
    console.log(userData);

    const users = await User.findAll({
        where: {
            [Op.or]: [{ email: userData.email }, { phoneNumber: userData.phone }]
        }
    });

    if(users[0]){
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

    res.status(200).json({users})
};