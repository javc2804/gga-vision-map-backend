import multer from "multer";
import XLSX from "xlsx";
import Transaction from "../models/transaction.js"; // Import Transaction model

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[1]; // Use the index of the sheet you want to read
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: "A" });

    // Create an object to track unique rows
    const uniqueTransactions = {}; // Renamed to uniqueTransactions

    rows.forEach((row) => {
      // Ignore rows with null 'ut'
      if (row.A === null) {
        return;
      }

      const transaction = {
        // Renamed to transaction
        status: row.E, // E2
        attention: row.I, // I2
        ut: row.A, // A2
        eje: row.B, // B1
        subeje: row.C, // C1
        marcaModelo: row.D, // D1
        // Add other fields as necessary
      };

      // Use 'ut' as key to ensure no duplicates
      uniqueTransactions[transaction.ut] = transaction; // Renamed to uniqueTransactions
    });

    // Convert the values of the object to an array
    const transactions = Object.values(uniqueTransactions); // Renamed to transactions

    const result = await Transaction.bulkCreate(transactions, {
      // Changed to Transaction.bulkCreate
      updateOnDuplicate: ["status", "attention", "ut"],
    });
    console.log(`Inserted ${result.length} rows`);
    res.status(200).send("File uploaded and data imported successfully.");
  } catch (error) {
    console.error("Error importing data: ", error);
    res.status(500).send("Error importing data: " + error.message);
  }
};

export { upload, uploadExcel };
