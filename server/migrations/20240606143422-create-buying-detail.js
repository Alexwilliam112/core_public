'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BuyingDetails', {
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
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ingredientName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      unit: {
        type: Sequelize.ENUM(['Kilogram', 'Gram', 'Onz', 'Piece']),
        allowNull: false
      },
      ExpenseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Buyings',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BuyingDetails');
  }
};