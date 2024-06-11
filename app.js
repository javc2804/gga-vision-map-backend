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
import noteInvoicesRoutes from "./routes/noteInvoices.js";
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

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => console.log("Tablas creadas"))
  .catch((error) => console.log(error));

app.listen(3000, () => console.log("Server running on port 3000"));
