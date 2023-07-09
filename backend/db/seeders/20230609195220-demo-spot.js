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
      address: "1 Madison Avenue",
      city: "New York City",
      state: "New York",
      country: "USA",
      lat: 37.7645358,
      lng: -122.4730327,
      name: "Queen's Garden",
      description: "A hidden gem nested in the heart of Manhattan.",
      price: 399.99,
      ownerId: 1
    },
    {
      address: "1355 U Street NW",
      city: "Washington",
      state: "D.C.",
      country: "USA",
      lat: 38.7645358,
      lng: -112.4730327,
      name: "King's Landing",
      description: "A wonderful spot.",
      price: 299.99,
      ownerId: 1
    },
    {
      address: "1111 Madison Avenue",
      city: "New York City",
      state: "New York",
      country: "USA",
      lat: 23,
      lng: -23,
      name: "Lofty Garden",
      description: "A hidden gem nested in the heart of Manhattan.",
      price: 399.99,
      ownerId: 1
    },
    {
      address: "4568 Prince Lane",
      city: "Des Moines",
      state: "Idaho",
      country: "USA",
      lat: 50.7698758,
      lng: -150.4709127,
      name: "The Chill Spot",
      description: "A cool spot.",
      price: 67.99,
      ownerId: 2
    },
    {
      address: "123 SDLFKJ street",
      city: "St. Louis",
      state: "Missouri",
      country: "USA",
      lat: 32,
      lng: -12,
      name: "Willie's Place",
      description: "A chill spot.",
      price: 39.99,
      ownerId: 2
    },
    {
      address: "123 Alphabet Road",
      city: "St. Louis",
      state: "Missouri",
      country: "USA",
      lat: 51.23,
      lng: -120.43,
      name: "Amaya's Place",
      description: "A chill spot.",
      price: 39.99,
      ownerId: 2
    },
    {
      address: "456 Dominic Plaza",
      city: "Chicago",
      state: "Illinois",
      country: "USA",
      lat: 32.7897358,
      lng: -147.4756727,
      name: "Windy Vistas",
      description: "A neat spot.",
      price: 99.99,
      ownerId: 3
    },
    {
      address: "6 Metropolitan Avenue",
      city: "Boston",
      state: "Massachusetts",
      country: "USA",
      lat: 20.7897358,
      lng: -111.4756727,
      name: "Scholar's Cove",
      description: "A nice spot.",
      price: 205.00,
      ownerId: 3
    },
    {
      address: "33333",
      city: "Boston",
      state: "Massachusetts",
      country: "USA",
      lat: 2,
      lng: -2,
      name: "33333",
      description: "A nice spot.",
      price: 333.33,
      ownerId: 3
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
      ownerId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
