const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const ForgotPassword = sequelize.define('forgetpassword',{
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    active: Sequelize.BOOLEAN,
})

module.exports = ForgotPassword;