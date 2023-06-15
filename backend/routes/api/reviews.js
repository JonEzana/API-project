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

// Add image to review based on reveiew id
router.post('/:reviewId/images', restoreUser, requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId, {include: [{model: ReviewImage}]});
    if (!review) {
        res.statusCode = 404;
        return res.json({message: "Review couldn't be found"})
    } else {
        if (req.user.id !== review.userId) {
            res.statusCode = 403;
            return res.json({message: "Forbidden"});
        } else {
            if (review.ReviewImages.length >= 10) {
                res.statusCode = 403;
                return res.json({message: "Maximum number of images for this resource was reached"})
            } else {
                let newImage = await ReviewImage.create({reviewId: review.id, url: req.body.url});
                newImage = newImage.toJSON();
                console.log('NEW IMAGE: ', newImage);
                res.json({id: newImage.id, url: newImage.url})
            }
        }
    }
});

// Delete a review
router.delete('/:reviewId', restoreUser, requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
        res.statusCode = 404;
        return res.json({message: "Review couldn't be found"})
    } else {
        if (req.user.id !== review.userId) {
            res.statusCode = 403;
            return res.json({message: "Forbidden"});
        } else {
            await review.destroy();
            res.statusCode = 200;
            return res.json({message: "Successfully deleted"})
        }
    }
});

module.exports = router;
