const express = require('express');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup');
const cors = require('cors');
const sequelize = require('./utils/database');
const User = require('./models/user');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

app.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'public','/login/login.html'));
})

app.use(signupRoute);

async function runServer(){
    await sequelize.sync();
    app.listen(3000);
}

runServer();
