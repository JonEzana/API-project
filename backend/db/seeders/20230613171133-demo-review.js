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
        userId: 2,
        review: "Roaches!!! Nice view tho",
        stars: 1
      },
      {
        spotId: 1,
        userId: 3,
        review: "apparently i get a voucher if i leave a good review soo pretty cool spot ig",
        stars: 3
      },
      {
        spotId: 2,
        userId: 1,
        review: "Literely the best ecsperiens of my lif!!1!",
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "It was aight",
        stars: 3
      },
      {
        spotId: 3,
        userId: 1,
        review: "Wonderful amenities, view, and access to public transportation.",
        stars: 4
      },
      {
        spotId: 3,
        userId: 2,
        review: "Couldn't have asked for a better place to stay during an otherwise hellish work trip!",
        stars: 5
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
