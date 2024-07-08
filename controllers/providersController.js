import xl from "excel4node";
import Provider from "../models/provider.js";
import { format } from "date-fns";

export const getProviders = async (req, res) => {
  try {
    const providers = await Provider.findAll({
      where: {
        status: true, // Asegura que solo se incluyan los proveedores con status igual a true
      },
      order: [["createdAt", "DESC"]], // Ordena por createdAt de forma descendente
    });
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const exportProvidersToExcel = async (req, res) => {
  try {
    const providers = await Provider.findAll({ raw: true });

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Providers");

    const headerStyle = wb.createStyle({
      font: {
        color: "#FFFFFF",
        bold: true,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "1F4E78",
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    });

    const headers = ["Fecha creado", "Nombre", "Creador por"];
    const columnWidths = new Array(headers.length).fill(0);

    // Añadir cabeceras
    headers.forEach((header, i) => {
      ws.cell(1, i + 1)
        .string(header)
        .style(headerStyle);
      columnWidths[i] = Math.max(columnWidths[i], header.length);
    });

    // Añadir datos
    providers.forEach((provider, index) => {
      const row = index + 2;
      const formattedDate = format(new Date(provider.createdAt), "dd/MM/yyyy");
      ws.cell(row, 1).string(formattedDate);
      ws.cell(row, 2).string(provider.name);
      ws.cell(row, 3).string(provider.user_rel);

      // Actualizar el ancho máximo de la columna si es necesario
      columnWidths[0] = Math.max(columnWidths[0], formattedDate.length);
      columnWidths[1] = Math.max(columnWidths[1], provider.name.length);
      columnWidths[2] = Math.max(columnWidths[2], provider.user_rel.length);
    });

    // Ajustar el ancho de las columnas
    columnWidths.forEach((width, i) => {
      ws.column(i + 1).setWidth(width + 2); // +2 para un poco de margen
    });

    // Escribir el archivo en el servidor y enviarlo
    const filePath = "./providers.xlsx";
    wb.write(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      } else {
        res.download(filePath, (err) => {
          if (err) throw err;
          // Opcional: eliminar el archivo después de enviarlo
          // fs.unlinkSync(filePath);
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editProvider = async (req, res) => {
  try {
    const { id, name, user_rel } = req.body.data;

    const provider = await Provider.findByPk(id);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    provider.name = name;
    provider.user_rel = user_rel;

    await provider.save();

    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProvider = async (req, res) => {
  try {
    const id = req.body.data;
    const provider = await Provider.findByPk(id);

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Cambiar el estado de true a false
    provider.status = false;

    // Guardar los cambios
    await provider.save();

    // Responder con un mensaje de éxito
    res.status(200).json({ message: "Provider status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createProvider = async (req, res) => {
  try {
    const { name, user_rel } = req.body.data;

    if (!name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProvider = await Provider.create({
      name,
      user_rel,
      status: true,
      createdAt: new Date(),
    });

    res.status(201).json(newProvider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
