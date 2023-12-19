'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourAdditionalImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TourAdditionalImages.belongsTo(models.Tours, { foreignKey: 'tourId' });
    }
  }
  TourAdditionalImages.init({
    tourId: DataTypes.INTEGER,
    additionalImage: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TourAdditionalImages',
  });
  return TourAdditionalImages;
};