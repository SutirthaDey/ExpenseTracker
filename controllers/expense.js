const Expense = require('../models/expense');
const User = require('../models/user');

exports.getExpense = async(req,res,next)=>{
    const date = req.query.date;
    console.log(date)
    const expenseList = await req.user.getExpenses({where: {date: date}});
    res.json({success: true, isPremium: req.user.isPremium, expenseList});
}

exports.postExpense = async(req,res,next)=>{
    const {amount,description,category,date} = req.body;
    console.log(amount,description,category,date);
    await req.user.createExpense({
        amount:+amount,
        description:description,
        category:category,
        date:date
    })
    res.json({success: true})
}