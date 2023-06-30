const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const router = express.Router();

// Delete review image
router.delete('/:reviewImgId', restoreUser, requireAuth, async (req, res) => {
    let img = await ReviewImage.findByPk(req.params.reviewImgId, {
        include: [{model: Review, include: [{model: User, attributes: ['id']}]}]
    });
    if (!img) {
        res.statusCode = 404;
        res.json({message: "Review Image couldn't be found"})
    } else {
        let image = img.toJSON();
        // console.log(image)
        if (req.user.id !== image.Review.User.id) {
            res.statusCode = 403;
            res.json({message: "Forbidden"})
        } else {
            await img.destroy();
            res.statusCode = 200;
            res.json({message: "Successfully deleted"})
        }
    }
})

module.exports = router;
