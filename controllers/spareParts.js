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
          attributes: ["partType"], // Usa el nombre correcto de la columna
        },
      ],
      attributes: {
        exclude: ["sparepartid"],
        include: [[Sequelize.literal(`"sparePart"."partType"`), "type"]], // Usa el nombre correcto de la columna
      },
    });

    console.log("sparePartVariants", sparePartVariants);

    const modifiedResults = sparePartVariants.map((variant) => ({
      ...variant.toJSON(),
      type: variant.sparePart.partType, // Ajusta según la estructura real de tus datos
    }));

    console.log("modifiedResults", modifiedResults);

    res.status(200).json(modifiedResults);
  } catch (error) {
    console.error("Error fetching spare parts:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createSpareParts = async (req, res) => {
  try {
    const { name, spareParts_variant, user_rel } = req.body.data; // Asegúrate de que los nombres de los atributos coincidan
    console.log(name);
    console.log(spareParts_variant);
    console.log(user_rel);
    // Crear el nuevo SparePart
    const newSparePart = await SparePart.create({
      name,
      partType: spareParts_variant, // Ajusta según la estructura real de tus datos
    });

    console.log("newSparePart", newSparePart);
    // Crear el nuevo SparePartVariant
    const newSparePartVariant = await SparePartVariant.create({
      variant: spareParts_variant,
      status: "active", // Ajusta según sea necesario
      sparepartid: 1,
      userid: 1, // Ajusta según la estructura real de tus datos
    });
    console.log("newSparePartVariant", newSparePartVariant);

    res.status(201).json({ newSparePart, newSparePartVariant });
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
          attributes: ["partType"], // Usa el nombre correcto de la columna
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
      ws.cell(row, 3).string(variant.sparePart.partType || ""); // Usa el nombre correcto de la columna
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
