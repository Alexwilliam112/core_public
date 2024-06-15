'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/payrollExpenses.json').map((el) => {
      el.createdAt = el.updatedAt = new Date()
      return el
    })

    await queryInterface.bulkInsert('PayrollExpenses', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('PayrollExpenses', null, {});
  }
};
