module.exports = (sequelize, type) => {
    return sequelize.define("follower", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        followerId: type.STRING

    });
};