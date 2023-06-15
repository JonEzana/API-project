const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const router = express.Router();

// Get all reviews of the current user
router.get('/current', restoreUser, requireAuth, async (req, res) => {
    if (req.user) {
        let reviews = await req.user.getReviews({
            include: [
                // {model: User, attributes: ['id', 'firstName', 'lastName']},
                // {model: Spot, include: [{model: SpotImage, attributes: ['url']}]}
                {model: User, attributes: ['id', 'firstName', 'lastName']}, {model: Spot, include: [{model: SpotImage}], attributes: {exclude: ['description', 'createdAt', 'updatedAt']}}, {model: ReviewImage, attributes: ['id', 'url']},
            ],
            order: ['id']
        });
        let Reviews = [];
        reviews.forEach(review => {
            Reviews.push(review.toJSON())
        });
        for (let i = 0; i < Reviews.length; i++) {
            let review = Reviews[i];
            for (let j = review.Spot.SpotImages.length - 1; j >= 0; j--) {
                let image = review.Spot.SpotImages[j];
                if (image.preview === true) {
                    review.Spot.previewImage = image.url;
                    break;
                } else {
                    review.Spot.previewImage = null;
                }
            }
        }
        res.json({Reviews})
    }
});



module.exports = router;
