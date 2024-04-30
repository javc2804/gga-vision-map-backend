require("dotenv").config(); // Añade esto para cargar las variables de entorno
const express = require("express");
const cors = require("cors"); // Importa cors
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const User = require("./models/user");
const sequelize = require("./config/database");

const app = express();

app.use(cors()); // Usa cors como middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/item", itemRoutes);

// Sincroniza los modelos con la base de datos
sequelize
  // .sync({ force: true }) // Super peligroso, esto puede borrar todos los registros al actualizar una columna
  .sync()
  .then(() => console.log("Tablas creadas"))
  .catch((error) => console.log(error));

app.listen(3000, () => console.log("Server running on port 3000"));
