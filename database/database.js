const Sequelize = require('sequelize');

// MODELS


const CommentModel = require("../models/comment");
const ConversationModel = require("../models/conversation");
const FollowerModel = require("../models/follower");
const FollowingModel = require("../models/following");
const FriendModel = require("../models/friend");
const FriendshipModel = require("../models/friendship");
const LikeModel = require("../models/like");
const MessageModel = require("../models/message");
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
const Conversation = ConversationModel(sequelize, Sequelize);
const Follower = FollowerModel(sequelize, Sequelize);
const Following = FollowingModel(sequelize, Sequelize);
const Friend = FriendModel(sequelize, Sequelize);
const Friendship = FriendshipModel(sequelize, Sequelize);
const Like = LikeModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);





//  RELATIONS

Message.belongsTo(Conversation);
Conversation.hasMany(Message, { foreignKey: 'conversationId', sourceKey: 'id' });

//  USER

Friend.belongsTo(User);
User.hasMany(Friend, { foreignKey: 'userId', sourceKey: 'id' });

Follower.belongsTo(User);
User.hasMany(Follower, { foreignKey: 'userId', sourceKey: 'id' });

Following.belongsTo(User);
User.hasMany(Following, { foreignKey: 'userId', sourceKey: 'id' });

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

// sequelize.sync({ alter: true }).then(() => {
//     console.log(`Database & tables created!`);
// });

// test changing



// EXPORT MODELS

module.exports = {
    Comment,
    Conversation,
    Follower,
    Following,
    Friend,
    Friendship,
    Like,
    Message,
    Post,
    User
}; 