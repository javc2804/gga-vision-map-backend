"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("transactions", "deudaTotalUsd", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0, // Esto es necesario porque has establecido allowNull en false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("transactions", "deudaTotalUsd");
  },
};
