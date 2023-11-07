module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Specialties', 'descriptionHTML', {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },),
      queryInterface.changeColumn('Specialties', 'descriptionMarkdown', {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Specialties', 'descriptionHTML', {
        type: Sequelize.TEXT,
        allowNull: true,
      },),
      queryInterface.changeColumn('Specialties', 'descriptionMarkdown', {
        type: Sequelize.TEXT,
        allowNull: true,
      },),
    ])
  }
};