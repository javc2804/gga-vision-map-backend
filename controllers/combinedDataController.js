import Fleet from "../models/fleet.js";
import PaymentType from "../models/paymenttype.js";
import SparePartVariant from "../models/SparePartsVariants.js";
import SparePart from "../models/SpareParts.js";
import Provider from "../models/provider.js"; // Import the Provider model

const getCombinedData = async (req, res) => {
  try {
    const fleets = await Fleet.findAll({
      attributes: ["ut", "marcaModelo", "eje", "subeje"],
    });
    const eje = (
      await Fleet.findAll({
        attributes: ["eje"],
        group: ["eje"],
      })
    )
      .filter((item) => item.eje)
      .map((item) => ({ ...item, eje: item.eje.toLowerCase() }));

    const subeje = (
      await Fleet.findAll({
        attributes: ["subeje"],
        group: ["subeje"],
      })
    )
      .filter((item) => item.subeje)
      .map((item) => ({ ...item, subeje: item.subeje.toLowerCase() }));
    const paymentTypes = await PaymentType.findAll({ attributes: ["types"] });
    const sparePartVariants = await SparePartVariant.findAll({
      attributes: ["variant"],
    });
    const spareParts = await SparePart.findAll({ attributes: ["type"] });
    const providers = await Provider.findAll({
      where: {
        status: true,
      },
    });
    res.json({
      fleets,
      eje, // Include the unique eje values
      subeje, // Include the unique subeje values
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
