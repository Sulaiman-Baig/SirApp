module.exports = (sequelize, type) => {
    return sequelize.define("message", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        senderId: type.STRING,
        receiverId: type.STRING,
        senderName: type.STRING,
        receiverName: type.STRING,
        messageBody: type.STRING,
        isRead: type.BOOLEAN

    });
};