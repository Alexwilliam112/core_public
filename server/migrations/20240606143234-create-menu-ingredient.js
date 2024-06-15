'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MenuIngredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      MenuId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Menus',
          key: 'id'
        }
      },
      IngredientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'MasterIngredients',
          key: 'id'
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MenuIngredients');
  }
};