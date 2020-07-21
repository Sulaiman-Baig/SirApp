module.exports = (sequelize, type) => {
    return sequelize.define("comment", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        comment: type.STRING

    });
};