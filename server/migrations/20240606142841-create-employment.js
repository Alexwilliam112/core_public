'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employments', {
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
      docStatus: {
        type: Sequelize.ENUM(['Active', 'Terminated']),
        defaultValue: 'Active'
      },
      employmentType: {
        type: Sequelize.ENUM(['Owner', 'Employee', 'Probation', 'Contract']),
        allowNull: false
      },
      joinDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      salary: {
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
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      JobtitleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Jobtitles',
          key: 'id'
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Employments');
  }
};