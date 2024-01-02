const { DataTypes } = require("sequelize");
const { sequelize } = require("./../../databases/mysql.init");

const User = sequelize.define("User", {
  fristName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

(async () => {
  await sequelize.sync({ alter: true });
  console.log("The table for the User model was just (re)created!");
})();

module.exports = User;
