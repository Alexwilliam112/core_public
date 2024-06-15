'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/buyingexpenses.json').map((el) => {
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('Buyings', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Buyings', null, {});
  }
};
