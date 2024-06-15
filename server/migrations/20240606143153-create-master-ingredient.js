'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MasterIngredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ingredientName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      unit: {
        type: Sequelize.ENUM(['Kilogram', 'Gram', 'Onz', 'Piece']),
        allowNull: false
      },
      updatedBy: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MasterIngredients');
  }
};