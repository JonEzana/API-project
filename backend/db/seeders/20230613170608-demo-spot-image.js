'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_730,h_487/stock%2F8ea241e96504a398f291a31939963e8ba948368c',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_730,h_487/stock%2F8ea241e96504a398f291a31939963e8ba948368c',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_730,h_487/stock%2F8ea241e96504a398f291a31939963e8ba948368c',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_730,h_487/stock%2F8ea241e96504a398f291a31939963e8ba948368c',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.houseplansservices.com/content/oanrn2hpo2onko9gr94416qock/w991x660.jpg?v=10',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://cdn.houseplansservices.com/content/oanrn2hpo2onko9gr94416qock/w991x660.jpg?v=10',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.houseplansservices.com/content/oanrn2hpo2onko9gr94416qock/w991x660.jpg?v=10',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.houseplansservices.com/content/oanrn2hpo2onko9gr94416qock/w991x660.jpg?v=10',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://homezonline.in/wp-content/uploads/2022/07/Simplex-single-floor-home.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://homezonline.in/wp-content/uploads/2022/07/Simplex-single-floor-home.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://homezonline.in/wp-content/uploads/2022/07/Simplex-single-floor-home.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://homezonline.in/wp-content/uploads/2022/07/Simplex-single-floor-home.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://homezonline.in/wp-content/uploads/2023/02/Home-design.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://homezonline.in/wp-content/uploads/2023/02/Home-design.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://homezonline.in/wp-content/uploads/2023/02/Home-design.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://homezonline.in/wp-content/uploads/2023/02/Home-design.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://homezonline.in/wp-content/uploads/2023/02/Home-design.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://homezonline.in/wp-content/uploads/2023/02/Home-design.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://homezonline.in/wp-content/uploads/2023/02/Home-design.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://homezonline.in/wp-content/uploads/2023/02/Home-design.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://media.istockphoto.com/id/524085051/photo/beautiful-exterior-of-new-luxury-home-at-twilight.jpg?s=612x612&w=0&k=20&c=wPqEpJkL22wE3NHSCgdWXq2FC8a-KvSCpP7XRIZHuOU=',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://media.istockphoto.com/id/524085051/photo/beautiful-exterior-of-new-luxury-home-at-twilight.jpg?s=612x612&w=0&k=20&c=wPqEpJkL22wE3NHSCgdWXq2FC8a-KvSCpP7XRIZHuOU=',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://media.istockphoto.com/id/524085051/photo/beautiful-exterior-of-new-luxury-home-at-twilight.jpg?s=612x612&w=0&k=20&c=wPqEpJkL22wE3NHSCgdWXq2FC8a-KvSCpP7XRIZHuOU=',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://media.istockphoto.com/id/524085051/photo/beautiful-exterior-of-new-luxury-home-at-twilight.jpg?s=612x612&w=0&k=20&c=wPqEpJkL22wE3NHSCgdWXq2FC8a-KvSCpP7XRIZHuOU=',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://media.istockphoto.com/id/1272128530/photo/home-with-blue-siding-and-stone-fa%C3%A7ade-on-base-of-home.jpg?s=1024x1024&w=is&k=20&c=VDy8DHZyQixBZCClDDVPonTDxAY3rLK8tSlrglZVTRo=',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://media.istockphoto.com/id/1272128530/photo/home-with-blue-siding-and-stone-fa%C3%A7ade-on-base-of-home.jpg?s=1024x1024&w=is&k=20&c=VDy8DHZyQixBZCClDDVPonTDxAY3rLK8tSlrglZVTRo=',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://media.istockphoto.com/id/1272128530/photo/home-with-blue-siding-and-stone-fa%C3%A7ade-on-base-of-home.jpg?s=1024x1024&w=is&k=20&c=VDy8DHZyQixBZCClDDVPonTDxAY3rLK8tSlrglZVTRo=',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://media.istockphoto.com/id/1272128530/photo/home-with-blue-siding-and-stone-fa%C3%A7ade-on-base-of-home.jpg?s=1024x1024&w=is&k=20&c=VDy8DHZyQixBZCClDDVPonTDxAY3rLK8tSlrglZVTRo=',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://media.istockphoto.com/id/171246403/photo/exterior-of-new-suburban-house.jpg?s=1024x1024&w=is&k=20&c=rhs8kxy2rKRPPKOsE9i4mVZvQslCsS86EPR47ppVNew=',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://media.istockphoto.com/id/171246403/photo/exterior-of-new-suburban-house.jpg?s=1024x1024&w=is&k=20&c=rhs8kxy2rKRPPKOsE9i4mVZvQslCsS86EPR47ppVNew=',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://media.istockphoto.com/id/171246403/photo/exterior-of-new-suburban-house.jpg?s=1024x1024&w=is&k=20&c=rhs8kxy2rKRPPKOsE9i4mVZvQslCsS86EPR47ppVNew=',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://media.istockphoto.com/id/171246403/photo/exterior-of-new-suburban-house.jpg?s=1024x1024&w=is&k=20&c=rhs8kxy2rKRPPKOsE9i4mVZvQslCsS86EPR47ppVNew=',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://media.istockphoto.com/id/968025444/photo/beautiful-luxury-home-exterior-on-bright-sunny-day-with-green-grass-and-blue-sky.jpg?s=1024x1024&w=is&k=20&c=TRghB_IXJ0WWNmC_oA8yinbwWDL4booSnN5tVVZYvlw=',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://media.istockphoto.com/id/968025444/photo/beautiful-luxury-home-exterior-on-bright-sunny-day-with-green-grass-and-blue-sky.jpg?s=1024x1024&w=is&k=20&c=TRghB_IXJ0WWNmC_oA8yinbwWDL4booSnN5tVVZYvlw=',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://media.istockphoto.com/id/968025444/photo/beautiful-luxury-home-exterior-on-bright-sunny-day-with-green-grass-and-blue-sky.jpg?s=1024x1024&w=is&k=20&c=TRghB_IXJ0WWNmC_oA8yinbwWDL4booSnN5tVVZYvlw=',
        preview: false
      },
      {
        spotId: 9,
        url: 'https://media.istockphoto.com/id/968025444/photo/beautiful-luxury-home-exterior-on-bright-sunny-day-with-green-grass-and-blue-sky.jpg?s=1024x1024&w=is&k=20&c=TRghB_IXJ0WWNmC_oA8yinbwWDL4booSnN5tVVZYvlw=',
        preview: false
      }
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9]}
    }, {})
  }
};
