import multer from "multer";
import readXlsxFile from "read-excel-file/node";
import Fleet from "../models/fleet.js";

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const rows = await readXlsxFile(req.file.buffer);
    // Remove header row
    rows.shift();

    // Create an object to track unique rows
    const uniqueFleets = {};

    rows.forEach((row) => {
      // Ignore rows with null 'ut'
      if (row[0] === null) {
        return;
      }

      const fleet = {
        status: row[4], // E2
        attention: row[8], // I2
        ut: row[0], // A2
        eje: row[1], // B1
        subeje: row[2], // C1
        marcaModelo: row[3], // D1
        // Add other fields as necessary
      };

      // Use 'ut' as key to ensure no duplicates
      uniqueFleets[fleet.ut] = fleet;
    });

    // Convert the values of the object to an array
    const fleets = Object.values(uniqueFleets);

    const result = await Fleet.bulkCreate(fleets, {
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
