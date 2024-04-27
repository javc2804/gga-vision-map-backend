// config/database.js
const Sequelize = require("sequelize");

module.exports = new Sequelize("test", "javier", "123456", {
  host: "localhost",
  dialect: "postgres",
});
