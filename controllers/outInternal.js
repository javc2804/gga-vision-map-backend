import OutInternal from "../models/outInternal.js";
import { Sequelize } from "sequelize";

const formFieldOptions = [
  { value: "", label: "Seleccione un tipo de gasto" }, // Opción por defecto
  { value: "apoyoInstitucional", label: "Apoyo institucional" },
  { value: "ayuda", label: "Ayuda" },
  { value: "bolsaDeTrabajo", label: "Bolsa de trabajo" },
  {
    value: "bonoVarios",
    label: "Bono (Coordinador, Vialidad, Recaudación y Apoyo Institucional)",
  },
  { value: "donacion", label: "Donación" },
  { value: "honorarios", label: "Honorarios" },
  { value: "viaticos", label: "Viáticos" },
  { value: "funcionamiento", label: "Funcionamiento" },
  { value: "nomina", label: "Nómina" },
  { value: "bonoCoordinadores", label: "Bono coordinadores" },
];

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
    // Obtener todos los registros
    const records = await OutInternal.findAll();

    // Obtener sumatorias de montos por tipo de gasto para ambas monedas
    const sumatorias = await OutInternal.findAll({
      attributes: [
        "tipoGasto",
        [
          Sequelize.fn("SUM", Sequelize.col("montoCompromisoBs")),
          "totalMontoCompromisoBs",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("montoPagadoBs")),
          "totalMontoPagadoBs",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("montoCompromisoUsd")),
          "totalMontoCompromisoUsd",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("montoPagadoUsd")),
          "totalMontoPagadoUsd",
        ],
      ],
      group: "tipoGasto",
      raw: true,
    });

    // Convertir las sumatorias en un objeto para fácil acceso
    const sumatoriasPorTipo = sumatorias.reduce(
      (
        acc,
        {
          tipoGasto,
          totalMontoCompromisoBs,
          totalMontoPagadoBs,
          totalMontoCompromisoUsd,
          totalMontoPagadoUsd,
        }
      ) => {
        acc[tipoGasto] = {
          totalMontoCompromisoBs: parseFloat(totalMontoCompromisoBs),
          totalMontoPagadoBs: parseFloat(totalMontoPagadoBs),
          totalMontoCompromisoUsd: parseFloat(totalMontoCompromisoUsd),
          totalMontoPagadoUsd: parseFloat(totalMontoPagadoUsd),
        };
        return acc;
      },
      {}
    );

    // Preparar el objeto de respuesta
    const respuesta = {
      row: records, // Todos los registros
      sumatorias: formFieldOptions.reduce((acc, { value }) => {
        if (value) {
          // Ignorar la opción por defecto
          acc[value] = sumatoriasPorTipo[value] || {
            totalMontoCompromisoBs: 0,
            totalMontoPagadoBs: 0,
            totalMontoCompromisoUsd: 0,
            totalMontoPagadoUsd: 0,
          };
        }
        return acc;
      }, {}),
    };

    res.status(200).json(respuesta);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los registros",
      error: error.message,
    });
  }
};
export default { register, list };
