'use strict';
const { hash } = require('../helpers/bcrypt')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const data = require('../data/users.json')
    data.forEach(el => {
      el.password = hash(el.password)
      el.createdAt = el.updatedAt = new Date()
    });

    await queryInterface.bulkInsert('Users', data, {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Users', null, {})
  }
};
