module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Clinics', 'provinceId',),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Clinics', 'provinceId', {
        type: Sequelize.STRING,
        allowNull: false,
      },),
    ])
  }
};