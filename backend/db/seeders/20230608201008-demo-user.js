'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'Lition'
      },
      {
        email: 'user1@user.io',
        username: 'User1',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'User',
        lastName: 'One'
      },
      {
        email: 'user2@user.io',
        username: 'User2',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'User',
        lastName: 'Two'
      },
      {
        email: 'user3@user.io',
        username: 'User3',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'User',
        lastName: 'Three'
      },
      {
        email: 'user4@user.io',
        username: 'User4',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'User',
        lastName: 'Four'
      },
      {
        email: 'user5@user.io',
        username: 'User5',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'User',
        lastName: 'Five'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'User1', 'User2', 'User3', 'User4', 'User5'] }
    }, {});
  }
};
