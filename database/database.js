const Sequelize = require('sequelize');

// MODELS


const CommentModel = require("../models/comment");
const LikeModel = require("../models/like");
const PostModel = require("../models/post");
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

const Comment = CommentModel(sequelize, Sequelize);
const Like = LikeModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);





//  RELATIONS

Like.belongsTo(User);
User.hasMany(Like, { foreignKey: 'userId', sourceKey: 'id' });

Like.belongsTo(Post);
Post.hasMany(Like, { foreignKey: 'postId', sourceKey: 'id' });

Comment.belongsTo(User);
User.hasMany(Comment, { foreignKey: 'userId', sourceKey: 'id' });

Comment.belongsTo(Post);
Post.hasMany(Comment, { foreignKey: 'postId', sourceKey: 'id' });

Post.belongsTo(User);
User.hasMany(Post, { foreignKey: 'userId', sourceKey: 'id' });

//TO UPDATE SCHEMA

sequelize.sync({ alter: true }).then(() => {
    console.log(`Database & tables created!`);
});

// test changing



// EXPORT MODELS

module.exports = {
    Comment,
    Like,
    Post,
    User
}; 