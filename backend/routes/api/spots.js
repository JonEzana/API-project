const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

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
router.get('/current', async (req, res) => {
    //auth
    requireAuth;
    if (req.user) {
        const spots = await req.user.getSpots({
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
        res.json({Spots});
    }
  })

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId, {include: [{model: Review}, {model: SpotImage, attributes: ['id', 'url', 'preview']}, {model: User, attributes: ['id', 'firstName', 'lastName']}]})

    if (!spot) {
        res.statusCode = 404;
        res.json({
            message: "Spot couldn't be found"
        });
    }
    else {
        spot = spot.toJSON();
        spot.numReviews = spot.Reviews.length;
        const avgStar = spot.Reviews.reduce((acc, rev) => {
            acc += rev.stars;
            return acc;
        }, 0);
        spot.avgStarRating = avgStar / spot.Reviews.length;
        spot.Owner = {
            id: spot.User.id,
            firstName: spot.User.firstName,
            lastName: spot.User.lastName
        }
        delete spot.Reviews;
        delete spot.User;
        res.json(spot)
    }
});

// Get all reviews for a spot by spot id
router.get('/:spotId/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {include: {model: Review, include: [{model: User, attributes: ['id', 'firstName', 'lastName']}, {model: ReviewImage, attributes: ['id', 'url']}]}});
    if (!spot) {
        res.statusCode = 404;
        res.json({
            message: "Spot couldn't be found"
        })
    } else {
        const Reviews = spot.Reviews;
        res.json({Reviews})
    }
});

// Add image to spot by spot id
router.post('/:spotId/images', async (req, res) => {
    //auth
    requireAuth;
    if (req.user) {
        let spot = await req.user.getSpots({
            where: {id: req.params.spotId},
            include: [{model: SpotImage}]
        });
        if (spot) {
            spot = spot[0].toJSON();
            const newImage = await SpotImage.create({ spotId: spot.id, url: req.body.url, preview: req.body.preview});
            spot.SpotImages.push(newImage)

            res.json({
                id: newImage.id,
                url: newImage.url,
                preview: newImage.preview
            })
        } else {
            res.statusCode = 404;
            res.json({
                message: "Spot couldn't be found"
            });
        }
    }
});






module.exports = router;
