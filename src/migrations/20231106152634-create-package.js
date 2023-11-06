'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Package', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      packageName: {
        type: Sequelize.STRING
      },
      packageType: {
        type: Sequelize.STRING
      },
      packageCity: {
        type: Sequelize.STRING
      },
      packageDescription: {
        type: Sequelize.STRING
      },
      packageImage: {
        type: Sequelize.STRING
      },
      packageDescription: {
        type: Sequelize.STRING
      },
      packagePrice: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Package');
  }
};