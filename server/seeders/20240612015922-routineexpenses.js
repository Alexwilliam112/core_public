'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/routineexpenses.json').map((el) => {
      el.postedBy = 'Haji Mamat'
      el.createdAt = el.updatedAt = new Date()
      return el
    })

    await queryInterface.bulkInsert('RoutineExpenses', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('RoutineExpenses', null, {});
  }
};
