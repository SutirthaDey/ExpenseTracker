const Expense = require('../models/expense');
const User = require('../models/user');

exports.getExpense = async(req,res,next)=>{
    res.json({success: true, isPremium: req.user.isPremium});
}

exports.postExpense = async(req,res,next)=>{
    const {expenseamount,description,category,date} = req.body;
    console.log(expenseamount,description,category,date);
    await req.user.createExpense({
        amount:+expenseamount,
        description:description,
        category:category,
        date:date
    })
    res.json({success: true})
}