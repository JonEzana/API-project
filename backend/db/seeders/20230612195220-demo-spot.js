'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'Spots';
   return queryInterface.bulkInsert(options, [
    {
      ownerId: 4,
      address: "123 Disney Lane",
      city: "San Francisco",
      state: "California",
      country: "USA",
      lat: 37.7645358,
      lng: -122.4730327,
      name: "App Academy",
      description: "Place where web developers are created",
      price: 123
    },
    {
      ownerId: 5,
      address: "456 King Lane",
      city: "Des Moines",
      state: "Idaho",
      country: "USA",
      lat: 50.7698758,
      lng: -150.4709127,
      name: "General Assembly",
      description: "Gas station App Academy",
      price: 456
    },
    {
      ownerId: 6,
      address: "789 Queen's Boulevard",
      city: "Lincoln",
      state: "Nebraska",
      country: "USA",
      lat: 34.7897358,
      lng: -146.4756727,
      name: "Code Dojo",
      description: "Cool Ranch Doritos of bootcamps",
      price: 789
    }
   ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Disney Lane', '456 King Lane', "789 Queen's Boulevard"]}
    }, {})
  }
};
