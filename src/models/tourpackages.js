'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourPackages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TourPackages.belongsTo(models.TourSchedules, { foreignKey: 'tourScheduleId' });
      TourPackages.belongsTo(models.Packages, { foreignKey: 'packageId' });
    }
  }
  TourPackages.init({
    tourScheduleId: DataTypes.INTEGER,
    packageId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TourPackages',
  });
  return TourPackages;
};