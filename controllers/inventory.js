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
    const { name, cantidad, user_rel } = description;

    // Buscar el registro de inventario por name
    let inventoryItem = await Inventory.findOne({
      where: { descripcion: name },
    });

    if (inventoryItem) {
      // Si el registro existe, sumar la cantidad proporcionada
      const newQuantity = inventoryItem.cantidad + Number(cantidad);
      await inventoryItem.update({ cantidad: newQuantity });
    } else {
      // Si el registro no existe, crear uno nuevo
      inventoryItem = await Inventory.create({
        descripcion: name,
        entrada: 0,
        salida: 0,
        proveedor: "Anteriores",
        cantidad: Number(cantidad),
        user_rel,
      });
    }

    res.status(200).json({
      message: "Operación realizada con éxito",
      inventoryItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar la solicitud" });
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
