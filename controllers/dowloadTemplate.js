import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const downloadExcel = (req, res) => {
  const file = resolve(__dirname, "../matriz.xlsm");
  res.setHeader("Content-Disposition", "attachment; filename=prueba.csv");
  res.download(file);
};

export { downloadExcel };
