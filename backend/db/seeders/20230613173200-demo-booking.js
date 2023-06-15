'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('05-10-2023'),
        endDate: new Date('05-12-2023')
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('05-15-2023'),
        endDate: new Date('05-19-2023')
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('05-24-2023'),
        endDate: new Date('05-30-2023')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
