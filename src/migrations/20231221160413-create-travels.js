'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Travels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startLocation: {
        type: Sequelize.STRING
      },
      startDateTime: {
        type: Sequelize.DATE
      },
      maxTicket: {
        type: Sequelize.INTEGER
      },
      remainTicket: {
        type: Sequelize.INTEGER
      },
      travelPrice: {
        type: Sequelize.DECIMAL
      },
      tourId: {
        type: Sequelize.INTEGER
      },
      discountId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Travels');
  }
};