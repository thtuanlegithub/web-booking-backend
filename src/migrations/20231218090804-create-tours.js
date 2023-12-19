'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tourName: {
        type: Sequelize.STRING
      },
      totalDay: {
        type: Sequelize.INTEGER
      },
      totalNight: {
        type: Sequelize.INTEGER
      },
      addressList: {
        type: Sequelize.TEXT
      },
      tourPrice: {
        type: Sequelize.DECIMAL
      },
      tourStatus: {
        type: Sequelize.STRING
      },
      tourImage: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Tours');
  }
};