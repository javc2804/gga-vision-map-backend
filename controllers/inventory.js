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

export default {
  getInventory,
};
