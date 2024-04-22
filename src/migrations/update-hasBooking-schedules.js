module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Schedules', 'hasBooking', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Schedules', 'hasBooking', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },)
    ])
  }
};