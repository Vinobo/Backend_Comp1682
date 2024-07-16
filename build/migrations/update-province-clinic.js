"use strict";

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.addColumn('Clinics', 'provinceId', {
      type: Sequelize.STRING,
      allowNull: false
    })]);
  },
  down: function down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('Clinics', 'provinceId', {
      type: Sequelize.STRING,
      allowNull: false
    })]);
  }
};