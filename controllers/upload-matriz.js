import multer from "multer";
import XLSX from "xlsx";
import Transaction from "../models/transaction.js";

const storage = multer.memoryStorage();
const uploadMatriz = multer({ storage: storage });

const uploadExcelMatriz = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];
    const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const rows = allRows.slice(16);

    const uniqueTransactions = {};
    const transactions = [];

    rows.forEach((row, index) => {
      const transaction = {
        ut: row[1],
        marcaModelo: row[2],
        eje: row[3],
        subeje: row[4],
        proveedor: row[5] || "",
        descripcion: "",
        repuesto: row[6],
        descripcionRepuesto: row[6],
        cantidad: row[7] || 0,
        precioUnitarioBs: +parseFloat(row[8] || 0).toFixed(2),
        montoTotalBs: +parseFloat(row[9] || 0).toFixed(2),
        precioUnitarioUsd: +parseFloat(row[10] || 0).toFixed(2),
        montoTotalUsd: +parseFloat(row[11] || 0).toFixed(2),
        deudaUnitarioUsd: +parseFloat(row[12] || 0).toFixed(2),
        deudaTotalUsd: +parseFloat(row[13] || 0).toFixed(2),
        tasaBcv: +parseFloat(row[54] || 0).toFixed(2),
        fechaTasa: convertDate(row[57]),
        formaPago: row[13] && row[13] > 0 ? "credito" : "contado",
        ocOs: "",
        numeroOrdenPago: "",
        fechaOcOs: null,
        ndeAlmacen: row[58],
        fechaEntrega: convertDate(row[59]),
        observacion: row[60] || "",
        status: true,
        user_rel: "admin@admin.com",
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
function convertDate(dateString) {
  if (typeof dateString !== "string" || dateString.trim() === "") {
    return null;
  }
  const parts = dateString.replace(/-/g, "/").split("/");
  if (
    parts.length !== 3 ||
    isNaN(parts[0]) ||
    isNaN(parts[1]) ||
    isNaN(parts[2])
  ) {
    return null;
  }
  const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().split("T")[0];
}

export { uploadMatriz, uploadExcelMatriz };
