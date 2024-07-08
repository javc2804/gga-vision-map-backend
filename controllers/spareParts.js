import xl from "excel4node";
import { format } from "date-fns";
import SparePartVariant from "../models/SparePartsVariants.js";
import SparePart from "../models/SpareParts.js";
import { Sequelize } from "sequelize";

export const getSpareParts = async (req, res) => {
  try {
    const sparePartVariants = await SparePartVariant.findAll({
      include: [
        {
          model: SparePart,
          as: "sparePart",
          attributes: [[Sequelize.literal(`"sparePart"."type"`), "type"]], // Utiliza Sequelize.literal para seleccionar directamente el campo 'type'
        },
      ],
      attributes: {
        exclude: ["sparepartid"],
        include: [[Sequelize.literal(`"sparePart"."type"`), "type"]], // Incluye el valor de 'type' directamente en los resultados
      },
    });

    const modifiedResults = sparePartVariants.map((variant) => ({
      ...variant.toJSON(),
      type: variant.sparePart.type, // Asegúrate de ajustar esta línea según la estructura real de tus datos
    }));

    res.status(200).json(modifiedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSpareParts = async (req, res) => {
  console.log(req.body);
  return;

  try {
    const { name, type } = req.body;
    console.log(name);
    console.log(type);

    // const newSparePart = await SparePart.create({
    //   name,
    //   type,
    // });

    res.status(201).json(newSparePart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const exportSparePartsToExcel = async (req, res) => {
  try {
    const sparePartVariants = await SparePartVariant.findAll({
      include: [
        {
          model: SparePart,
          as: "sparePart",
          attributes: ["type"], // Asegurarse de que 'type' es el campo correcto
        },
      ],
      raw: true,
      nest: true,
    });

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Spare Parts Variants");

    const headerStyle = wb.createStyle({
      font: {
        color: "#FFFFFF",
        bold: true,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#1F4E78",
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    });

    const headers = [
      "ID",
      "Fecha Creación",
      "Repuesto",
      "Descripción de Repuesto",
      "Creado Por",
      "Estado",
    ];
    headers.forEach((header, i) => {
      ws.cell(1, i + 1)
        .string(header)
        .style(headerStyle);
    });

    sparePartVariants.forEach((variant, index) => {
      const row = index + 2;
      ws.cell(row, 1).number(variant.id);
      ws.cell(row, 2).string(format(new Date(variant.createdAt), "dd/MM/yyyy"));
      ws.cell(row, 3).string(variant.sparePart.type || ""); // Usa 'type' para 'Descripción de Repuesto'
      ws.cell(row, 4).string(variant.variant || ""); // Usa el valor actual para 'Repuesto'
      ws.cell(row, 5).string(variant.userid || "");
      ws.cell(row, 6).string(variant.status || "");
    });

    ws.column(1).setWidth(10);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(30);
    ws.column(5).setWidth(15);
    ws.column(6).setWidth(10);

    const filePath = "./sparePartsVariants.xlsx";
    wb.write(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      } else {
        res.download(filePath, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error al descargar el archivo");
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
