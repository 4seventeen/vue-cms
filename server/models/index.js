const sequelize = require("../config/database");
const User = require("./User")(sequelize);

// Add more models here and export
module.exports = {
  sequelize,
  User,
};
