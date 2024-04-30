require("dotenv").config(); // Añade esto para cargar las variables de entorno
const express = require("express");
const cors = require("cors"); // Importa cors
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transaction");
const sequelize = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);

sequelize
  // .sync({ force: true }) // Super peligroso, esto puede borrar todos los registros al actualizar una columna
  .sync()
  .then(() => console.log("Tablas creadas"))
  .catch((error) => console.log(error));

app.listen(3000, () => console.log("Server running on port 3000"));
