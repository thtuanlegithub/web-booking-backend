'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Package.init({
    packageName: DataTypes.STRING,
    packageType: DataTypes.STRING,
    packageCity: DataTypes.STRING,
    packageDescription: DataTypes.STRING,
    packageImage: DataTypes.STRING,
    packageDescription: DataTypes.STRING,
    packagePrice: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Package',
  });
  return Package;
};