'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/payrollDetails.json')
    await queryInterface.bulkInsert('PayrollDetails', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('PayrollDetails', null, {});
  }
};
