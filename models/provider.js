import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const Provider = sequelize.define("Provider", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  user_rel: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Provider;
