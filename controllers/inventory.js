import Inventory from "../models/inventory.js";

const getInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.findAll();
    res.status(200).json(inventoryItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el inventario" });
  }
};
const getInventoryByDescription = async (req, res) => {
  try {
    const { description } = req.body; // Obtiene el parámetro de consulta 'description'
    if (!description) {
      return res.status(400).json({ error: "La descripción es requerida" });
    }
    const inventoryItems = await Inventory.findAll({
      where: {
        descripcion: description, // Asume que 'descripcion' es el nombre de la columna en tu tabla
      },
    });
    res.status(200).json(inventoryItems);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al obtener el inventario por descripción" });
  }
};

export default {
  getInventory,
  getInventoryByDescription,
};
