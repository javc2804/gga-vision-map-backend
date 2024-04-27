// config/database.js
const Sequelize = require("sequelize");

module.exports = new Sequelize(
  "visionmap",
  "transmiranda",
  "$$Tr4nsM1r4nD4$$",
  {
    host: "localhost",
    dialect: "postgres",
  }
);
