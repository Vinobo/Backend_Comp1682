"use strict";

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.renameColumn('Doctor_Infors', 'count', 'remote')]);
  },
  down: function down(queryInterface, DataTypes) {
    return Promise.all([queryInterface.renameColumn('Doctor_Infors', 'remote', 'count')]);
  }
};