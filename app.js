import dotenv from "dotenv";
dotenv.config(); // Añade esto para cargar las variables de entorno
import express from "express";
import cors from "cors"; // Importa cors
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";
import sequelize from "./config/database.js";
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
