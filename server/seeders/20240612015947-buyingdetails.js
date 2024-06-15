'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/buyingdetails.json')
    await queryInterface.bulkInsert('BuyingDetails', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('BuyingDetails', null, {});
  }
};
