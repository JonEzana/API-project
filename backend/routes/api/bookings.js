const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

// const validateDate = [
//     check('review')
//       .exists()
//       .withMessage('Review text is required'),
//     check('stars')
//       .exists()
//       .isInt({min: 0, max: 5})
//       .withMessage('Stars must be an integer from 0 to 5'),
//     handleValidationErrors
//   ];

const router = express.Router();

// Get all bookings for current user
router.get('/current', restoreUser, requireAuth, async (req, res) => {
    if (req.user) {
        const bookings = await req.user.getBookings({
            include: [{model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'], include: [{model: SpotImage, attributes: ['preview', 'url']}]}]
        });

        let Bookings = [];
        bookings.forEach(booking => {
            Bookings.push(booking.toJSON())
        });

        Bookings.forEach(booking => {
           for (let i = booking.Spot.SpotImages.length - 1; i >= 0; i--) {
                const img = booking.Spot.SpotImages[i];
                if (img.preview === true) {
                    booking.Spot.previewImage = img.url;
                    break;
                } else {
                    booking.Spot.previewImage = null;
                }
           }
           delete booking.Spot.SpotImages;
        });
        res.json({Bookings})
    }
});



module.exports = router;
