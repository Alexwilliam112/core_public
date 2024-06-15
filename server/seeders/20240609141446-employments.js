'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    const data = require('../data/employments.json')
    await queryInterface.bulkInsert('Employments', data, {})
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Employments', null, {})
  }
};
