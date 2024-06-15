'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/masterIngredients.json')
    await queryInterface.bulkInsert('MasterIngredients', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('MasterIngredients', null, {});
  }
};
