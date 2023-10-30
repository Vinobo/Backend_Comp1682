module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('Doctor_Infors', 'count', 'remote'),
    ])
  },

  down: (queryInterface, DataTypes) => {
    return Promise.all([
      queryInterface.renameColumn('Doctor_Infors', 'remote', 'count'),
    ])
  }
};