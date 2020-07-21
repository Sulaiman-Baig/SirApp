module.exports = (sequelize, type) => {
    return sequelize.define("post", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        totalLikes: type.INTEGER,
        totalComments: type.INTEGER,        
        postText: type.STRING,
        postImage: type.STRING
    });
};