module.exports = (sequelize, type) => {
    return sequelize.define("friend", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        friendId: type.STRING,
        isFriend: type.BOOLEAN

    });
};