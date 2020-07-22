module.exports = (sequelize, type) => {
    return sequelize.define("friendship", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        userId: type.BOOLEAN,
        friendId: type.STRING

    });
};