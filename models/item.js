// models/item.js
const Sequelize = require("sequelize");
const db = require("../config/database");

const Item = db.define("item", {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
});

// Sincronizar el modelo con la base de datos
db.sync()
  .then(() => console.log("Table created"))
  .catch((error) => console.log("Error: ", error));

module.exports = Item;
