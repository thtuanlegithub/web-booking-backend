'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tours.hasMany(models.TourSchedules, { foreignKey: 'tourId' });
      Tours.hasMany(models.TourAdditionalImages, { foreignKey: 'tourId' });
      Tours.hasMany(models.Travels, { foreignKey: 'tourId' });
    }
  }
  Tours.init({
    tourName: DataTypes.STRING,
    totalDay: DataTypes.INTEGER,
    totalNight: DataTypes.INTEGER,
    addressList: DataTypes.TEXT,
    tourPrice: DataTypes.DECIMAL,
    tourStatus: DataTypes.STRING,
    mainImage: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tours',
  });
  return Tours;
};