'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PayrollDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salaryPaid: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bank: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      EmploymentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Employments',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      PayId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PayrollExpenses',
          key: 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PayrollDetails');
  }
};