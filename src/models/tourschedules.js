'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourSchedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TourSchedules.belongsTo(models.Tours, { foreignKey: 'tourId' });
      TourSchedules.belongsToMany(models.Packages, {
        through: models.TourPackages,
        foreignKey: 'tourScheduleId',
        otherKey: 'packageId'
      });
    }
  }
  TourSchedules.init({
    tourId: DataTypes.INTEGER,
    dayIndex: DataTypes.INTEGER,
    daySummary: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TourSchedules',
  });
  return TourSchedules;
};