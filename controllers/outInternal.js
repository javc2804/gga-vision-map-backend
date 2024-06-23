import OutInternal from "../models/outInternal.js"; // Asegúrate de que la ruta sea correcta

const register = async (req, res) => {
  try {
    const newOutInternal = await OutInternal.create(req.body.data);

    res.status(201).json({
      message: "Registro creado con éxito",
      data: newOutInternal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el registro",
      error: error.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const records = await OutInternal.findAll();
    // Suponiendo que mantenimiento, funcionamiento y otros son objetos que quieres enviar
    const mantenimiento = {
      /* datos de mantenimiento */
    };
    const funcionamiento = {
      /* datos de funcionamiento */
    };
    const otros = {
      /* otros datos */
    };

    res.status(200).json({
      row: records,
      mantenimiento,
      funcionamiento,
      otros,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los registros",
      error: error.message,
    });
  }
};
export default { register, list };
