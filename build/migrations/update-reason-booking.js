"use strict";

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.addColumn('Bookings', 'reason', {
      type: Sequelize.TEXT,
      allowNull: true
    })]);
  },
  down: function down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('Bookings', 'reason', {
      type: Sequelize.TEXT,
      allowNull: true
    })]);
  }
};