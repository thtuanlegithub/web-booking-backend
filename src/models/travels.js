'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Travels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Travels.belongsTo(models.Tours, { foreignKey: 'tourId' });
      Travels.hasMany(models.Bookings, { foreignKey: 'travelId' });
      Travels.belongsTo(models.Discounts, { foreignKey: 'discountId' });
    }
  }
  Travels.init({
    startLocation: DataTypes.STRING,
    startDateTime: DataTypes.DATE,
    maxTicket: DataTypes.INTEGER,
    remainTicket: DataTypes.INTEGER,
    travelPrice: DataTypes.DECIMAL,
    tourId: DataTypes.INTEGER,
    discountId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Travels',
  });
  return Travels;
};