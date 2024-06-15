'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/expensetypes.json')
    await queryInterface.bulkInsert('ExpenseTypes', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('ExpenseTypes', null, {});
  }
};
