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

    const columnGroups = [
      [6, 7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20, 21],
      [22, 23, 24, 25, 26, 27, 28, 29],
      [30, 31, 32, 33, 34, 35, 36, 37],
      [38, 39, 40, 41, 42, 43, 44, 45],
      [46, 47, 48, 49, 50, 51, 52, 53],
    ];
    const indicesDescripcionRepuesto = [6, 14, 22, 30, 38, 46];

    rows.forEach((row, index) => {
      let values = [0, 0, 0, 0, 0, 0, 0, 0]; // Initialize values with an array of zeros

      for (let group of columnGroups) {
        if (!group.every((idx) => !row[idx] || row[idx] === "0.00")) {
          values = group.map((idx) => {
            if (indicesDescripcionRepuesto.includes(idx)) {
              return row[idx] || "0";
            } else {
              return +parseFloat(row[idx] || 0).toFixed(2);
            }
          });
          break;
        }
      }

      const transaction = {
        ut: isNaN(row[1]) ? null : row[1],
        marcaModelo: isNaN(row[2]) ? null : row[2],
        eje: isNaN(row[3]) ? null : row[3],
        subeje: isNaN(row[4]) ? null : row[4],
        proveedor: row[5] || "",
        descripcion: "",
        repuesto: row[6] ? row[6].toString() : null,
        descripcionRepuesto: indicesDescripcionRepuesto.includes(index)
          ? row[index] || null
          : null,
        cantidad: isNaN(values[1]) ? null : values[1],
        precioUnitarioBs: isNaN(values[2]) ? null : values[2],
        montoTotalBs: isNaN(values[3]) ? null : values[3],
        precioUnitarioUsd: isNaN(values[4]) ? null : values[4],
        montoTotalUsd: isNaN(values[5]) ? null : values[5],
        deudaUnitarioUsd: isNaN(values[6]) ? null : values[6],
        deudaTotalUsd: isNaN(values[7]) ? null : values[7],
        tasaBcv: +parseFloat(row[54] || 0).toFixed(2),
        fechaTasa: convertDate(row[57]),
        formaPago: row[13] && row[13] > 0 ? "credito" : "contado",
        ocOs: "",
        numeroOrdenPago: "",
        fechaOcOs: null,
        ndeAlmacen: isNaN(row[58]) ? null : row[58],
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
