'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bookings.belongsTo(models.Travels, { foreignKey: 'travelId' });
      Bookings.hasMany(models.Tourists, { foreignKey: 'bookingId' });
      Bookings.belongsTo(models.Customers, { foreignKey: 'customerId' });
    }
  }
  Bookings.init({
    bookingStatus: DataTypes.STRING,
    bookingPrice: DataTypes.DECIMAL,
    customerId: DataTypes.INTEGER,
    paymentNote: DataTypes.STRING,
    paymentImage: DataTypes.TEXT,
    travelId: DataTypes.INTEGER,
    exportInvoice: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Bookings',
  });
  return Bookings;
};