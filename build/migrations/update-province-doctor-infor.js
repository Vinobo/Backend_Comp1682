"use strict";

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.addColumn('Doctor_Infors', 'provinceId', {
      type: Sequelize.STRING,
      allowNull: false
    })]);
  },
  down: function down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('Doctor_Infors', 'provinceId', {
      type: Sequelize.STRING,
      allowNull: false
    })]);
  }
};