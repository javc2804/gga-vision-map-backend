import OutInternal from "../models/outInternal.js";
import { Sequelize } from "sequelize";

const register = async (req, res) => {
  try {
    const preparedData = req.body.data.map((data) => {
      // Convertir fechas a objetos Date de JavaScript
      data.fechaTasa = data.fechaTasa ? new Date(data.fechaTasa) : null;
      data.fechaPago = data.fechaPago ? new Date(data.fechaPago) : null;
      data.fechaFactura = data.fechaFactura
        ? new Date(data.fechaFactura)
        : null;

      // Convertir strings numéricos a números
      data.montoPagadoBs = parseFloat(data.montoPagadoBs);
      data.montoCompromisoUsd = parseFloat(data.montoCompromisoUsd);
      data.montoCompromisoBs = parseFloat(data.montoCompromisoBs);
      data.montoPagadoUsd = parseFloat(data.montoPagadoUsd);
      data.tasaBcv = parseFloat(data.tasaBcv);

      // Asegurarse de que los campos que no necesitan transformación estén correctamente asignados
      data.id_items = data.id_items;
      data.proveedorBeneficiario = data.proveedorBeneficiario;
      data.descripcionGasto = data.descripcionGasto;
      data.ordenPagoNumero = data.ordenPagoNumero;
      data.relacionMesPago = data.relacionMesPago;
      data.tipoGasto = data.tipoGasto;
      data.user_rel = data.user_rel;

      return data;
    });

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
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los registros",
      error: error.message,
    });
  }
};

export default { register, list };
