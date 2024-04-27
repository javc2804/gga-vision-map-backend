require("dotenv").config(); // Añade esto para cargar las variables de entorno
const express = require("express");
const authRoutes = require("./routes/auth");
const { User, sequelize } = require("./models/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

// Sincroniza los modelos con la base de datos
sequelize
  .sync()
  .then(() => console.log("Tablas creadas"))
  .catch((error) => console.log(error));

app.listen(3000, () => console.log("Seerver running on port 3000"));
