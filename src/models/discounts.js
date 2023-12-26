'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Discounts.hasMany(models.Travels, { foreignKey: 'discountId' });
    }
  }
  Discounts.init({
    discountName: DataTypes.STRING,
    discountType: DataTypes.STRING,
    discountAmount: DataTypes.DECIMAL,
    discountDescription: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Discounts',
  });
  return Discounts;
};