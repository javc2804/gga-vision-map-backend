import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class OutInternal extends Model {}

OutInternal.init(
  {
    proveedor_beneficiario: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mantenimiento_adquisicion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_factura_bs_mantenimiento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_pagado_bolivares_mantenimiento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_factura_dolares_mantenimiento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_pagado_dolares_mantenimiento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    beneficiario_gasto_personal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gasto_personal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monto_pagado_bs_personal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_pagado_dolares_personal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    beneficiario_donaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    donaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monto_pagado_bolivares_donaciones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_pagado_dolares_donaciones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    impuestos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_pagado_bolivares_impuesto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_pagado_dolares_impuesto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    aportes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_pagado_bs_aportes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monto_pagado_dolares_aportes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    num_factura: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_factura: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    num_referencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cuenta_bancaria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tasa_bcv: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    fecha_tasa: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    num_orden_pago: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    relacion_mes_pago: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observacion: {
      type: DataTypes.STRING,
      allowNull: true, // Asumiendo que la observación puede ser opcional
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true, // Asumiendo que la observación puede ser opcional
    },
    user_rel: {
      type: DataTypes.STRING,
      allowNull: true, // Asumiendo que la observación puede ser opcional
    },
  },
  {
    sequelize,
    modelName: "OutInternal",
    tableName: "OutInternals",
  }
);

export default OutInternal;
