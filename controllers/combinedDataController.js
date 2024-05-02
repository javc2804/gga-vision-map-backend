import Fleet from "../models/fleet.js";
import PaymentType from "../models/paymenttype.js";
import SparePartVariant from "../models/SparePartsVariants.js";
import SparePart from "../models/SpareParts.js";

const getCombinedData = async (req, res) => {
  try {
    const fleets = await Fleet.findAll({ attributes: ["ut"] });
    const paymentTypes = await PaymentType.findAll({ attributes: ["types"] });
    const sparePartVariants = await SparePartVariant.findAll({
      attributes: ["variant"],
    });
    const spareParts = await SparePart.findAll({ attributes: ["type"] });

    res.json({
      fleets,
      paymentTypes,
      sparePartVariants,
      spareParts,
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
};

export { getCombinedData };
