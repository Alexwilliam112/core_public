'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/sales.json').map((el) => {
      el.updatedAt = new Date()
      return el
    })

    await queryInterface.bulkInsert('Sales', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Sales', null, {});
  }
};
