module.exports = (sequelize, type) => {
    return sequelize.define("admin", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true
      },
      
      userName: type.STRING,
      email: type.STRING,
      password: type.STRING,
      isSuperAdmin: type.BOOLEAN,
      isApproved: type.BOOLEAN,
 
     
    });
  };
  