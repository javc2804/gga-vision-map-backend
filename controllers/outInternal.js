import OutInternal from "../models/outInternal.js"; // Asegúrate de que la ruta sea correcta

const register = async (req, res) => {
  try {
    const preparedData = req.body.data.map((data) => {
      if (
        data.fecha_tasa &&
        !isNaN(new Date(data.fecha_tasa + "T00:00:00").getTime())
      ) {
        data.fecha_tasa = new Date(data.fecha_tasa + "T00:00:00");
      } else {
        data.fecha_tasa = null; // O manejar de otra manera
      }

      // Repetir para fecha_factura y fecha_pago con la misma lógica
      if (
        data.fecha_factura &&
        !isNaN(new Date(data.fecha_factura + "T00:00:00").getTime())
      ) {
        data.fecha_factura = new Date(data.fecha_factura + "T00:00:00");
      } else {
        data.fecha_factura = null; // O manejar de otra manera
      }

      if (
        data.fecha_pago &&
        !isNaN(new Date(data.fecha_pago + "T00:00:00").getTime())
      ) {
        data.fecha_pago = new Date(data.fecha_pago + "T00:00:00");
      } else {
        data.fecha_pago = null; // O manejar de otra manera
      }

      return data;
    });

    console.log(preparedData);

    const results = await OutInternal.bulkCreate(preparedData, {
      validate: true,
    });

    res.status(201).json({
      message: "Registros creados con éxito",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear los registros",
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
