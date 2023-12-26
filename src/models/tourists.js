'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tourists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tourists.belongsTo(models.Bookings, { foreignKey: 'bookingId' })
    }
  }
  Tourists.init({
    touristName: DataTypes.STRING,
    bookingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tourists',
  });
  return Tourists;
};