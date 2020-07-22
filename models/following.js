module.exports = (sequelize, type) => {
    return sequelize.define("follwing", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        followingId: type.STRING

    });
};