'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clinics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.BLOB('long')
      },
      introHTML: {
        type: Sequelize.TEXT('long')
      },
      introMarkdown: {
        type: Sequelize.TEXT('long')
      },
      specialtyHTML: {
        type: Sequelize.TEXT('long')
      },
      specialtyMarkdown: {
        type: Sequelize.TEXT('long')
      },
      deviceHTML: {
        type: Sequelize.TEXT('long')
      },
      deviceMarkdown: {
        type: Sequelize.TEXT('long')
      },
      locationHTML: {
        type: Sequelize.TEXT('long')
      },
      locationMarkdown: {
        type: Sequelize.TEXT('long')
      },
      processHTML: {
        type: Sequelize.TEXT('long')
      },
      processMarkdown: {
        type: Sequelize.TEXT('long')
      },
      provinceId: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Clinics');
  }
};