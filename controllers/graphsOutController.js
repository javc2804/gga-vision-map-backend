import { Sequelize, Op } from "sequelize";

import Transaction from "../models/transaction.js";

const getDataGraph = async (req, res) => {
  try {
    const { startDate, endDate, formaPago, ...filters } = req.query;

    const cleanedFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    const where = {
      ...cleanedFilters,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    const ejes = ["spz", "am", "met", "ocm", "blv"];
    const categories = [
      "cauchos",
      "repuestos",
      "servicios",
      "preventivos",
      "lubricantes",
      "baterias",
    ];

    const results = {};

    // Calculate totals for each category without considering the axis
    results["total"] = {};
    for (let category of categories) {
      const totalField =
        formaPago === "credito"
          ? Sequelize.fn("sum", Sequelize.col("deudaTotalUsd"))
          : formaPago === "" || formaPago === undefined
          ? Sequelize.fn(
              "sum",
              Sequelize.literal('"deudaTotalUsd" + "montoTotalUsd"')
            )
          : Sequelize.fn("sum", Sequelize.col("montoTotalUsd"));

      const data = await Transaction.findAll({
        where: { ...where, repuesto: category },
        attributes: [[totalField, "total"]],
      });

      const totalCantidad = await Transaction.sum("cantidad", {
        where: { ...where, repuesto: category },
      });

      results["total"][category] = {
        total:
          data.length && data[0].get("total")
            ? parseFloat(data[0].get("total").toFixed(2))
            : 0,
        cantidad: totalCantidad || 0,
      };
    }

    // Calculate totals for each category considering the axis
    for (let eje of ejes) {
      results[eje] = {};
      for (let category of categories) {
        const totalField =
          formaPago === "credito"
            ? Sequelize.fn("sum", Sequelize.col("deudaTotalUsd"))
            : formaPago === "" || formaPago === undefined
            ? Sequelize.fn(
                "sum",
                Sequelize.literal('"deudaTotalUsd" + "montoTotalUsd"')
              )
            : Sequelize.fn("sum", Sequelize.col("montoTotalUsd"));

        const data = await Transaction.findAll({
          where: { ...where, repuesto: category, eje },
          attributes: [[totalField, "total"]],
        });

        const totalCantidad = await Transaction.sum("cantidad", {
          where: { ...where, repuesto: category, eje },
        });

        results[eje][category] = {
          total:
            data.length && data[0].get("total")
              ? parseFloat(data[0].get("total").toFixed(2))
              : 0,
          cantidad: totalCantidad || 0,
        };
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getDataGraph };
