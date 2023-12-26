'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customers.hasMany(models.Bookings, { foreignKey: 'customerId' });
      Customers.belongsTo(models.CustomerAccounts, { foreignKey: 'customerAccountId' });
    }
  }
  Customers.init({
    customerPhone: DataTypes.STRING,
    customerName: DataTypes.STRING,
    customerGmail: DataTypes.STRING,
    customerAccountId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Customers',
  });
  return Customers;
};