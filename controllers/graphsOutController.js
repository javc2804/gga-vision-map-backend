import { Sequelize, Op } from "sequelize";

import Transaction from "../models/transaction.js";

const getDataGraph = async (req, res) => {
  try {
    const { startDate, endDate, ...filters } = req.query;

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
      const data = await Transaction.findAll({
        where: { ...where, repuesto: category },
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("montoTotalUsd")), "total"],
        ],
      });

      results["total"][category] =
        data.length && data[0].get("total")
          ? parseFloat(data[0].get("total").toFixed(2))
          : 0;
    }

    // Calculate totals for each category considering the axis
    for (let eje of ejes) {
      results[eje] = {};
      for (let category of categories) {
        const data = await Transaction.findAll({
          where: { ...where, repuesto: category, eje },
          attributes: [
            [Sequelize.fn("sum", Sequelize.col("montoTotalUsd")), "total"],
          ],
        });

        results[eje][category] =
          data.length && data[0].get("total")
            ? parseFloat(data[0].get("total").toFixed(2))
            : 0;
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getDataGraph };
