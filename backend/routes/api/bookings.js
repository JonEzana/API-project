const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check, body } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const router = express.Router();

const validateDate = [
    check('startDate')
        .exists({checkFalsy: true})
        .isDate()
        .withMessage('Please enter a valid start date in YYYY-MM-DD format'),
    check('endDate')
        .exists({checkFalsy: true})
        .isDate()
        .withMessage('Please enter a valid end date in YYYY-MM-DD format'),
    handleValidationErrors
    ];

const isStartDateGood = (startingDate) => {
    const starDate = new Date(startingDate).getTime();
    const currentDate = new Date().getTime();
    return starDate > currentDate;
}

const isEndDateGood = (startingDate, endingDate) => {
    const starDate = new Date(startingDate).getTime();
    const endDate = new Date(endingDate).getTime();
    return endDate > starDate
}

const isEndDatePast = (endingDate) => {
    const enDate = new Date(endingDate).getTime();
    const currentDate = new Date().getTime();
    return enDate > currentDate;
}

const checkBookingConflict = (oldBooking, newStar, newEn) => {
    const start = new Date(oldBooking.startDate).getTime();
    const end = new Date(oldBooking.endDate).getTime();
    const newStart = new Date(newStar).getTime();
    const newEnd = new Date(newEn).getTime();
    if (newStart >= start && newStart <= end) {
        return "start"
    }
    if (newEnd > start && newEnd <= end) {
        return "end"
    };
}

const checkBookingDateValidity = (startDate, endDate) => {
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

// Edit a booking
router.put('/:bookingId', requireAuth, validateDate, async (req, res) => {
    const {startDate, endDate} = req.body;
    const checkStart = isStartDateGood(startDate);
    const checkEnd = isEndDateGood(startDate, endDate);
    const validEnd = isEndDatePast(endDate);
    const bookingDateValidity = checkBookingDateValidity(startDate, endDate);
    let err = {};

    let booking = await Booking.findByPk(req.params.bookingId, {include: {model: Spot, include: {model: Booking}}});
    if (!booking) {
        res.statusCode = 404;
        return res.json({message: "Booking couldn't be found"})
    } else if (req.user.id !== booking.userId) {
        res.statusCode = 403;
        return res.json({message: "Forbidden"})
    } else if (validEnd === false) {
        res.statusCode = 400;
        return res.json({message: "Past bookings can't be modified"});
    } else if (checkStart === false) {
        res.statusCode = 400;
        err.message = "Bad Request"
        err.errors = {"startDate": 'Start date cannot be on or before current date'};
        return res.json(err)
    } else if (checkEnd === false) {
        res.statusCode = 400;
        err.message = "Bad Request"
        err.errors = {"endDate": 'End date cannot be on or before start date'};
        return res.json(err)
    } else if (bookingDateValidity === false) {
        res.statusCode = 400;
        return res.json({message: "Past bookings can't be modified"});
    } else {
        for (let existingBooking of booking.Spot.Bookings) {
            const invalidDate = checkBookingConflict(existingBooking, startDate, endDate);
            if (invalidDate === 'start') {
                err.message = "Sorry, this spot is already booked for the specified dates";
                err.errors = {"startDate": 'Start date conflicts with an existing booking'}
                res.statusCode = 400;
                return res.json(err);
            } else if (invalidDate === 'end') {
                err.message = "Sorry, this spot is already booked for the specified dates";
                err.errors = {"endDate": "End date conflicts with an existing booking"}
                res.statusCode = 400;
                return res.json(err);
            }
        }
    }
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();
    const {id, spotId, userId, createdAt, updatedAt} = booking;
    res.statusCode = 200;
    res.json({id, spotId, userId, startDate, endDate, createdAt, updatedAt})
});

// Delete booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    let booking = await Booking.findByPk(req.params.bookingId, {include: [{model: Spot, attributes: ['ownerId']}]});
    if (!booking) {
        res.statusCode = 404;
        return res.json({message: "Booking couldn't be found"})
    } else {
        const isStartDateBeforePresent = checkBookingDateValidity(booking.startDate, booking.endDate)
        if ((req.user.id !== booking.userId) && (req.user.id !== booking.Spot.ownerId)) {
            res.statusCode = 403;
            return res.json({message: "Forbidden"})
        } else if (isStartDateBeforePresent === false) {
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
