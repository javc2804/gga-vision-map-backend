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

    // Calcular las sumas totales para mantenimiento
    const totalsMantenimiento = await OutInternal.findAll({
      attributes: [
        [
          Sequelize.fn("SUM", Sequelize.col("monto_factura_bs_mantenimiento")),
          "totalMontoFacturaBs",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.col("monto_pagado_bolivares_mantenimiento")
          ),
          "totalMontoPagadoBs",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.col("monto_factura_dolares_mantenimiento")
          ),
          "totalMontoFacturaDolares",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.col("monto_pagado_dolares_mantenimiento")
          ),
          "totalMontoPagadoDolares",
        ],
      ],
      raw: true,
    });

    // Calcular las sumas totales para otros
    const totalsOtros = await OutInternal.findAll({
      attributes: [
        [
          Sequelize.fn("SUM", Sequelize.col("monto_pagado_bs_personal")),
          "totalMontoPagadoBsPersonal",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("monto_pagado_dolares_personal")),
          "totalMontoPagadoDolaresPersonal",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.col("monto_pagado_bolivares_donaciones")
          ),
          "totalMontoPagadoBsDonaciones",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("monto_pagado_dolares_donaciones")),
          "totalMontoPagadoDolaresDonaciones",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("monto_pagado_bolivares_impuesto")),
          "totalMontoPagadoBsImpuesto",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("monto_pagado_dolares_impuesto")),
          "totalMontoPagadoDolaresImpuesto",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("monto_pagado_bs_aportes")),
          "totalMontoPagadoBsAportes",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("monto_pagado_dolares_aportes")),
          "totalMontoPagadoDolaresAportes",
        ],
      ],
      raw: true,
    });

    // Construir el objeto de respuesta
    const mantenimiento = {
      adquisicion: {
        sumaTotalMontoFacturaBs:
          parseFloat(totalsMantenimiento[0].totalMontoFacturaBs) || 0,
        sumaTotalMontoPagadoBs:
          parseFloat(totalsMantenimiento[0].totalMontoPagadoBs) || 0,
        sumaTotalMontoFacturaDolares:
          parseFloat(totalsMantenimiento[0].totalMontoFacturaDolares) || 0,
        sumaTotalMontoPagadoDolares:
          parseFloat(totalsMantenimiento[0].totalMontoPagadoDolares) || 0,
      },
    };

    const otros = {
      gastos_personal: {
        monto_pagado_bs_personal:
          parseFloat(totalsOtros[0].totalMontoPagadoBsPersonal) || 0,
        monto_pagado_dolares_personal:
          parseFloat(totalsOtros[0].totalMontoPagadoDolaresPersonal) || 0,
      },
      donaciones: {
        monto_pagado_bolivares_donaciones:
          parseFloat(totalsOtros[0].totalMontoPagadoBsDonaciones) || 0,
        monto_pagado_dolares_donaciones:
          parseFloat(totalsOtros[0].totalMontoPagadoDolaresDonaciones) || 0,
      },
      impuestos: {
        monto_pagado_bolivares_impuesto:
          parseFloat(totalsOtros[0].totalMontoPagadoBsImpuesto) || 0,
        monto_pagado_dolares_impuesto:
          parseFloat(totalsOtros[0].totalMontoPagadoDolaresImpuesto) || 0,
      },
      aportes: {
        monto_pagado_bs_aportes:
          parseFloat(totalsOtros[0].totalMontoPagadoBsAportes) || 0,
        monto_pagado_dolares_aportes:
          parseFloat(totalsOtros[0].totalMontoPagadoDolaresAportes) || 0,
      },
    };

    res.status(200).json({
      row: records,
      mantenimiento,
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
