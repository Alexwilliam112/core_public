'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jobtitles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jobtitleName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Jobtitles');
  }
};