import Inventory from "../models/inventory.js";
import HistoryInventory from "../models/HistoryInventory.js"; // Asegúrate de ajustar la ruta de importación según tu estructura de proyecto

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

const updateInventoryQuantity = async (req, res) => {
  try {
    // Extraer el objeto description del cuerpo de la solicitud
    const { description } = req.body;
    const { id, name: additionalQuantity } = description;

    // Buscar el registro de inventario por ID
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      return res
        .status(404)
        .json({ error: "Registro de inventario no encontrado" });
    }

    // Convertir name a número y sumarlo a la cantidad actual
    const newQuantity = inventoryItem.cantidad + Number(additionalQuantity);

    // Actualizar la cantidad en el registro
    await inventoryItem.update({ cantidad: newQuantity });

    res
      .status(200)
      .json({ message: "Cantidad actualizada con éxito", inventoryItem });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al actualizar la cantidad del inventario" });
  }
};

export const getHistoryInventories = async (req, res) => {
  try {
    // Opcional: Añade lógica para manejar filtros de búsqueda si es necesario
    // Por ejemplo, filtrar por 'provider' si se pasa un query param 'provider'
    const filter = {};
    if (req.query.provider) {
      filter.provider = req.query.provider;
    }

    // Encuentra todos los registros en la tabla HistoryInventories, opcionalmente filtrados
    const historyInventories = await HistoryInventory.findAll({
      where: filter,
      // Opcional: Añade ordenamiento, límites, y otras opciones aquí
    });

    // Si todo va bien, devuelve los registros encontrados
    res.status(200).json(historyInventories);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  getInventory,
  getInventoryByDescription,
  updateInventoryQuantity,
  getHistoryInventories,
};
