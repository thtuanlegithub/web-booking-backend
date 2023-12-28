'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Packages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Packages.belongsToMany(models.TourSchedules, {
        through: models.TourPackages,
        foreignKey: 'packageId',
        otherKey: 'tourScheduleId'
      });
    }
  }
  Packages.init({
    packageName: DataTypes.STRING,
    packageType: DataTypes.STRING,
    packageAddress: DataTypes.STRING,
    packageDescription: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Packages',
  });
  return Packages;
};