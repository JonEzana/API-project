'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: "Roaches!!!",
        stars: 1
      },
      {
        spotId: 1,
        userId: 3,
        review: "Literally the chillest spot. I am not a roach btw :)",
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: "Talking roaches wtf. Would give -2 stars if I could.",
        stars: 0
      },
      {
        spotId: 2,
        userId: 2,
        review: "It was aight.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 3,
        review: "Wonderful amenities, view, and access to public transportation.",
        stars: 4
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
