module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Doctor_Infors', 'nameClinic',),
      queryInterface.removeColumn('Doctor_Infors', 'addressClinic',),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Doctor_Infors', 'nameClinic', {
        type: Sequelize.STRING,
        allowNull: false,
      },),
      queryInterface.addColumn('Doctor_Infors', 'addressClinic', {
        type: Sequelize.STRING,
        allowNull: false,
      },)
    ])
  }
};