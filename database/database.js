const Sequelize = require('sequelize');

// MODELS


const UserModel = require("../models/user");


// SEQUELIZE CONNECTION

const sequelize = new Sequelize("sirapp", "root", "root1234", {
    

    host: "localhost",
    dialect: "mysql",
    // operatorsAliases: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// MODELS CREATIONS WITH SWQUELIZE

const User = UserModel(sequelize, Sequelize);





//  RELATIONS



//TO UPDATE SCHEMA

// sequelize.sync({ alter: true }).then(() => {
//     console.log(`Database & tables created!`);
// });

// test changing



// EXPORT MODELS

module.exports = {
    User
}; 