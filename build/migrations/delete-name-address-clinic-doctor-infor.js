"use strict";

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('Doctor_Infors', 'nameClinic'), queryInterface.removeColumn('Doctor_Infors', 'addressClinic')]);
  },
  down: function down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.addColumn('Doctor_Infors', 'nameClinic', {
      type: Sequelize.STRING,
      allowNull: false
    }), queryInterface.addColumn('Doctor_Infors', 'addressClinic', {
      type: Sequelize.STRING,
      allowNull: false
    })]);
  }
};