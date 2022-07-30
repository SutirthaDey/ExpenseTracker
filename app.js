const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup');
const expenseRoute = require('./routes/expense');
const paymentRoute = require('./routes/payment');
const cors = require('cors');
const sequelize = require('./utils/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const path = require('path');
const Razorpay = require('razorpay');

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

User.hasMany(Expense);
Expense.belongsTo(User);

app.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'public','login.html'));
})

app.use(signupRoute);
app.use('/expense', expenseRoute);
app.use('/payment', paymentRoute);

async function runServer(){
    await sequelize.sync();
    app.listen(3000);
}

runServer();
