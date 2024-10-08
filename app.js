import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";
import uploadRoutes from "./routes/upload.js";
import combinedDataRoutes from "./routes/combinedDataRoutes.js"; // Nueva línea
import sequelize from "./config/database.js";
import providerRoutes from "./routes/providerRoutes.js";
import downloadTemplateRoutes from "./routes/downloadTemplateRoutes.js";
import graphOutRoutes from "./routes/graphsOutRoutes.js";
import UsersRoutes from "./routes/usersRoute.js";
import outInternalRoutes from "./routes/outInternalRoutes.js";
import noteInvoicesRoutes from "./routes/noteInvoices.js";
import sparePartsRoutes from "./routes/sparePartsRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import NoteInvoice from "./models/note_invoices.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

NoteInvoice.sync()
  .then(() => console.log('Table "note_invoices" has been created.'))
  .catch((error) => console.log("An error occurred:", error));

app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);
app.use("/upload", uploadRoutes);
app.use("/combinedData", combinedDataRoutes);
app.use("/note-invoices", noteInvoicesRoutes);
app.use("/providers", providerRoutes);
app.use("/download-template", downloadTemplateRoutes);
app.use("/graphs-out", graphOutRoutes);
app.use("/users", UsersRoutes);
app.use("/out-internal", outInternalRoutes);
app.use("/spare-parts", sparePartsRoutes);
app.use("/inventory", inventoryRoutes);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => console.log("Tablas creadas"))
  .catch((error) => console.log(error));

// Usa la variable de entorno PORT o por defecto el puerto 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
