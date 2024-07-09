import Sequelize from "sequelize";
import sequelize from "../config/database.js";
import Fleet from "./fleet.js";

const NoteInvoice = sequelize.define("note_invoices", {
  note_number: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  delivered_by: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  observation: {
    type: Sequelize.TEXT,
  },
  spare_part: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  spare_part_variant: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  provider: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  ut: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  eje: {
    type: Sequelize.STRING,
  },
  subeje: {
    type: Sequelize.STRING,
  },
  marcaModelo: {
    type: Sequelize.STRING,
  },
  inventario: {
    type: Sequelize.STRING,
  },
});

NoteInvoice.belongsTo(Fleet, {
  foreignKey: "ut",
  targetKey: "ut",
  as: "fleet",
});
export default NoteInvoice;
