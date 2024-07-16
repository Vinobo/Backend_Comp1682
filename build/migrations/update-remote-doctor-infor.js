"use strict";

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.changeColumn('Doctor_Infors', 'remote', {
      type: Sequelize.BOOLEAN,
      allowNull: false
    })]);
  },
  down: function down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.changeColumn('Doctor_Infors', 'remote', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    })]);
  }
};