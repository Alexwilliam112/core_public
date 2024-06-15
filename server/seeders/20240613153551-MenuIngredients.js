'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/menuIngredients.json')
    await queryInterface.bulkInsert('MenuIngredients', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('MenuIngredients', null, {});
  }
};
