'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/salesdetails.json')
    await queryInterface.bulkInsert('SalesDetails', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('SalesDetails', null, {});
  }
};
