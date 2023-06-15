const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const validateSpotCreation = [
    check('address')
      .exists()
      .withMessage('Street address is required'),
    check('city')
      .exists()
      .isLength({min: 3})
      .withMessage('City is required'),
    check('state')
      .exists()
      .withMessage('State is required'),
    check('country')
      .exists()
      .withMessage('Country is required'),
    check('lat')
      .exists()
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists()
      .withMessage('Longitude is not valid'),
    check('name')
      .exists()
      .isLength({max: 49})
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists()
      .withMessage('Description is required'),
    check('price')
      .exists()
      .withMessage('Price per day is required'),
    handleValidationErrors
  ];

  const validateReviewCreation = [
    check('review')
      .exists()
      .withMessage('Review text is required'),
    check('stars')
      .exists()
      .isInt({min: 0, max: 5})
      .withMessage('Stars must be an integer from 0 to 5'),
    handleValidationErrors
  ];

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
router.get('/current', requireAuth, async (req, res) => {
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
router.post('/:spotId/images', restoreUser, requireAuth, async (req, res) => {

    let spot = await Spot.findByPk(req.params.spotId, {include: [{model: SpotImage}]});
    if (!spot) {
        res.statusCode = 404;
        res.json({message: "Spot couldn't be found"});
    }  else {
        spot = spot.toJSON();
        console.log('SPOT: ', spot)
        // AUTHORIZATION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (req.user.id !== spot.ownerId) {
            res.statusCode = 403;
            res.json({message: "Forbidden"})
        } else {
            const newImage = await SpotImage.create({ spotId: spot.id, url: req.body.url, preview: req.body.preview});
            spot.SpotImages.push(newImage)
            res.json({id: newImage.id, url: newImage.url, preview: newImage.preview})
        }
    }
});

// Create a Spot
router.post('', requireAuth, validateSpotCreation, async (req, res) => {
    // const error = {};
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const newSpot = await Spot.create({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        ownerId: req.user.id
    });
    res.statusCode = 201;
    res.json({
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt
    })
});

// Edit a spot
router.put('/:spotId', requireAuth, validateSpotCreation, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.statusCode = 404;
        res.json({message: "Spot couldn't be found"});
    }  else {
        spot = spot.toJSON();
        // AUTHORIZATION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (req.user.id !== spot.ownerId) {
            res.statusCode = 403;
            res.json({message: "Forbidden"})
        } else {
            spot.address = req.body.address;
            spot.city = req.body.city,
            spot.state = req.body.state,
            spot.country = req.body.country,
            spot.lat = req.body.lat,
            spot.lng = req.body.lng,
            spot.name = req.body.name,
            spot.description = req.body.description,
            spot.price = req.body.price;
            res.statusCode = 200;
            res.json(spot)
        }
    }
})

// Delete a spot -- AUTHORIZATION
router.delete('/:spotId', requireAuth, async (req, res) => {
    console.log('REQ: ', req, '/REQ')
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        res.statusCode = 404;
        res.json({message: "Spot couldn't be found"})
    } else {
        if (req.user.id !== spot.ownerId) {
            res.statusCode = 403;
            res.json({message: "Forbidden"})
        } else {
            await spot.destroy();
            res.statusCode = 200;
            res.json({message: "Successfully deleted"})
        }
    }
});

// Create a Review for a Spot based on Spot id
router.post('/:spotId/reviews', requireAuth, validateReviewCreation, async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        res.statusCode = 404;
        return res.json({message: "Spot couldn't be found"})
    } else {
        let reviews = await spot.getReviews({where: {userId: req.user.id}});
        console.log('REVIEWS: ', reviews)
        if (reviews.length) {
            res.statusCode = 500;
            return res.json({message: "User already has a review for this spot"})
        } else {
            const { review, stars } = req.body;
            const newReview = await Review.create({
                userId: req.user.id,
                spotId: req.params.spotId,
                review,
                stars,
            });
            res.json(newReview)
        }
    }
});

// Get all bookings for a spot by spot id
router.get('/:spotId/bookings', restoreUser, requireAuth, async (req, res) => {
    let Bookings;
    let spot = await Spot.findByPk(req.params.spotId, {include: [{model: Booking, attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'], include: [{model: User, attributes: ['id', 'firstName', 'lastName']}]}, ]});
    if (!spot) {
        res.statusCode = 404;
        return res.json({message: "Spot couldn't be found"});
    } else {
        spot = spot.toJSON();
        Bookings = spot.Bookings;
        res.statusCode = 200;
        if (req.user) {
            if (req.user.id === spot.ownerId) {
                return res.json({Bookings});
            } else {
                Bookings.forEach(booking => {
                    delete booking.User;
                    delete booking.id;
                    delete booking.userId;
                    delete booking.createdAt;
                    delete booking.updatedAt;
                });
                return res.json({Bookings});
            }
        }
    }
});

module.exports = router;
