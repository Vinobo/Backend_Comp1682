module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Clinics', 'provinceId', {
        type: Sequelize.STRING,
        allowNull: false,
      },),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Clinics', 'provinceId', {
        type: Sequelize.STRING,
        allowNull: false,
      },)
    ])
  }
};