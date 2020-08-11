module.exports = (sequelize, type) => {
    return sequelize.define("user", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true
      },      
      name: type.STRING,
      email: type.STRING,
      password: type.STRING,
      gender: type.STRING,
      dob: type.STRING,
      marriageStatus: type.STRING,
      profilePicUrl: type.STRING,     
      coverPicUrl: type.STRING,     
      inviteCode: type.STRING,     
    });
  };
  