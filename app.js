const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup');
const expenseRoute = require('./routes/expense');
const paymentRoute = require('./routes/payment');
const passwordRoute = require('./routes/password');
const cors = require('cors');
const sequelize = require('./utils/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotpassword');
const path = require('path');
const Razorpay = require('razorpay');

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

app.get('/',(req,res,next)=>{
    console.log("Welcome to ExpenseTracker");
    res.sendFile(path.join(__dirname,'public','login.html'));
})

app.use(signupRoute);
app.use(expenseRoute);
app.use('/payment', paymentRoute);
app.use('/password',passwordRoute);

async function runServer(){
    await sequelize.sync();
    app.listen(process.env.PORT || 3000);
}

runServer();
