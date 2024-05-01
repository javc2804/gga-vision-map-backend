import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";
import uploadRoutes from "./routes/upload.js"; // Asegúrate de que la ruta sea correcta
import sequelize from "./config/database.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);
app.use("/upload", uploadRoutes); // Agrega esta línea

sequelize
  .sync()
  .then(() => console.log("Tablas creadas"))
  .catch((error) => console.log(error));

app.listen(3000, () => console.log("Server running on port 3000"));
