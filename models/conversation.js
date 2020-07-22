module.exports = (sequelize, type) => {
    return sequelize.define("conversation", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        senderId: type.STRING,
        receiverId: type.STRING

    });
};