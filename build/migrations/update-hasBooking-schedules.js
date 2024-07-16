"use strict";

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.addColumn('Schedules', 'hasBooking', {
      type: Sequelize.BOOLEAN,
      allowNull: false
    })]);
  },
  down: function down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('Schedules', 'hasBooking', {
      type: Sequelize.BOOLEAN,
      allowNull: false
    })]);
  }
};