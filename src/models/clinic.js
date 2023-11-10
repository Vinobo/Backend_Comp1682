'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clinic.hasMany(models.Doctor_Infor, { foreignKey: 'clinicId', as: 'clinicData' })
    }
  }
  Clinic.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    image: DataTypes.STRING,
    introHTML: DataTypes.TEXT,
    introMarkdown: DataTypes.TEXT,
    specialtyHTML: DataTypes.TEXT,
    specialtyMarkdown: DataTypes.TEXT,
    deviceHTML: DataTypes.TEXT,
    deviceMarkdown: DataTypes.TEXT,
    locationHTML: DataTypes.TEXT,
    locationMarkdown: DataTypes.TEXT,
    processHTML: DataTypes.TEXT,
    processMarkdown: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};