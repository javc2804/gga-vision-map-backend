import Fleet from "../models/fleet.js";
import PaymentType from "../models/paymenttype.js";
import SparePartVariant from "../models/SparePartsVariants.js";
import SparePart from "../models/SpareParts.js";
import Provider from "../models/provider.js"; // Import the Provider model

const getCombinedData = async (req, res) => {
  try {
    const fleets = await Fleet.findAll({
      attributes: ["ut", "eje", "subeje", "marcaModelo"],
    });
    const paymentTypes = await PaymentType.findAll({ attributes: ["types"] });
    const sparePartVariants = await SparePartVariant.findAll({
      attributes: ["variant"],
    });
    const spareParts = await SparePart.findAll({ attributes: ["type"] });
    const providers = await Provider.findAll(); // Fetch the providers

    res.json({
      fleets,
      paymentTypes,
      sparePartVariants,
      spareParts,
      providers, // Include the providers in the response
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
};

export { getCombinedData };
