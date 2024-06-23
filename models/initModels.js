// models/initModels.js
import SparePart from "./SpareParts.js";
import SparePartVariant from "./SparePartsVariants.js";

const initModels = () => {
  SparePart.hasMany(SparePartVariant, {
    foreignKey: "sparepartid",
    as: "variants",
  });

  SparePartVariant.belongsTo(SparePart, {
    foreignKey: "sparepartid",
    as: "SparePart",
  });
};

export default initModels;
