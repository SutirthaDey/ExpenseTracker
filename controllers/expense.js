const Expense = require('../models/expense');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const itemsPerPage = 5;

exports.getExpense = async(req,res,next)=>{
    const date = req.query.date;
    const currentPage = req.query.page || 1;
    console.log(currentPage);
    const totalItems = await Expense.count({
        where: {
            [Op.and]: 
            [
                {userId: req.user.id},
                {date: {[Op.substring]: date}}
            ]
        }
    })
    const totalPages = Math.ceil(totalItems/itemsPerPage);
    const expenseList = await req.user.getExpenses(
        {
            where: 
            { date: 
                {[Op.substring]: date}
            },
            offset: (currentPage-1)*itemsPerPage,
            limit: 5       
        },
    );
    res.json({success: true, isPremium: req.user.isPremium, expenseList, totalPages, totalItems});
}

exports.postExpense = async(req,res,next)=>{
    const {amount,description,category,date} = req.body;

    await req.user.createExpense({
        amount:+amount,
        description:description,
        category:category,
        date:date
    })
    res.json({success: true})
}

exports.getLeaderBoard = async(req,res,next)=>{
    const totalExpense = await Expense.findAll({
        include: [
            {model: User, attributes: ['name']}
          ],
        attributes: [
          'userId',
          [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
        ],
        group: ['userId'],
        limit: 10
      });
    res.json({totalExpense});
}