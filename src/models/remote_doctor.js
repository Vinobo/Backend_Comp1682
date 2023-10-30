'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Remote_Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Remote_Doctor.hasMany(models.Doctor_Infor, { foreignKey: 'specialtyId', as: 'specialtyData' })
    }
  }
  Remote_Doctor.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Remote_Doctor',
  });
  return Remote_Doctor;
};