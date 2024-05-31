import multer from "multer";
import XLSX from "xlsx";
import Transaction from "../models/transaction.js"; // Import Transaction model

const storage = multer.memoryStorage();
const uploadMatriz = multer({ storage: storage });

const uploadExcelMatriz = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[1]; // Use the index of the sheet you want to read
    const worksheet = workbook.Sheets[sheetName];
    const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const rows = allRows.slice(16); // Omit the first 16 rows

    const uniqueTransactions = {};
    const transactions = [];

    rows.forEach((row, index) => {
      const transaction = {
        ut: row[1],
        eje: row[3],
        subeje: row[4],
        proveedor: row[5] || "",
        marcaModelo: row[2],
        descripcion: row[6], // Descripción
        repuesto: row[6] || "repu", // Descripción
        descripcionRepuesto: row[6] || "repu", // Descripción
        cantidad: row[7] || 0, // Cantidad
        precioUnitarioBs: row[8] || 0, // Precio unitario en bs
        montoTotalBs: row[9] || 0, // Monto total en Bs
        precioUnitarioUsd: row[10] || 0, // Precio unitario en Usd
        montoTotalUsd: row[11] || 0, // Monto total en Usd
        deudaTotalUsd: row[13] || 0, // Deuda en Usd
        status: row[7],
        formaPago: "defa",
        numeroOrdenPago: row[57] || 0,
        fechaOcOs: isValidDate(row[55]) ? new Date(row[55]) : new Date(),
        tasaBcv: row[54] || 0,
        observacion: row[58] || "",
        ocOs: "",
        user_rel: "javier@admin.com",
      };

      uniqueTransactions[index] = transaction;
      transactions.push(transaction);
    });

    try {
      const result = await Transaction.bulkCreate(transactions);
      console.log(`Inserted ${result.length} rows`);
    } catch (error) {
      console.error("Error during insertion:", error);
    }
    res.status(200).send("File uploaded and data imported successfully.");
  } catch (error) {
    console.error("Error importing data: ", error);
    res.status(500).send("Error importing data: " + error.message);
  }
};

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date);
}

export { uploadMatriz, uploadExcelMatriz };
