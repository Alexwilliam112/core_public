'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    const data = require('../data/jobtitles.json')
    await queryInterface.bulkInsert('Jobtitles', data, {})
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Jobtitles', null, {})
  }
};
