const express = require('express');
const { Spot, Review, User, SpotImage, Owner } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');

const router = express.Router();

// Get all Spots
router.get('', async (req, res) => {
    const spots = await Spot.findAll({
        include: [{model: Review}, {model: SpotImage}],
        order: ['id']
    });

    let Spots = [];
    spots.forEach(spot => {
        Spots.push(spot.toJSON())
    });

    Spots.forEach(spot => {
        spot.SpotImages.forEach(spotImage => {
            if (spotImage.preview === true) {
                spot.previewImage = spotImage.url
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = null;
        }
    });

    Spots.forEach(spot => {
        let total = 0;
        spot.Reviews.forEach(review => {
            total += review.stars;
        });
        spot.avgRating = total / spot.Reviews.length
        delete spot.Reviews;
        delete spot.SpotImages;
    });

    res.json({Spots})

});

// Get all Spots owned by the Current User
// router.get('/current', async (req, res) => {
//     console.log('SAFEUSER: ', safeUser);
//     res.json('hi')
//   })

// Get details of a Spot from an id
// router.get('/:id', async (req, res) => {
//     const spot = await Spot.findByPk(req.params.id);
//     const spotWithImage = await spot.getSpotImage()
//     res.json(spotWithImage)
// })






module.exports = router;
