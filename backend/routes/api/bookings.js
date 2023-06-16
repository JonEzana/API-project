const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check, body } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const router = express.Router();

const checkBookingDeletion = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return (start > now && end > now)
}

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

// Delete booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    let booking = await Booking.findByPk(req.params.bookingId, {include: [{model: Spot, attributes: ['ownerId']}]});
    if (!booking) {
        res.statusCode = 404;
        return res.json({message: "Booking couldn't be found"})
    } else {
        if ((req.user.id !== booking.userId) && (req.user.id !== booking.Spot.ownerId)) {
            res.statusCode = 403;
            return res.json({message: "Forbidden"})
        } else if (checkBookingDeletion(booking.startDate, booking.endDate) === false) {
            res.statusCode = 403;
            return res.json({message: "Bookings that have been started can't be deleted"});
        } else {
            await booking.destroy();
            res.statusCode = 200;
            res.json({message: "Successfully deleted"})
        }
    }
});


module.exports = router;
