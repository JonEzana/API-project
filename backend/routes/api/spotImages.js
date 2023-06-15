const express = require('express');
const { Spot, Review, User, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const {Sequelize} = require('sequelize');
const { restoreUser, requireAuth } = require('../../utils/auth');

const router = express.Router();

//Delete spot image
router.delete('/:imageId', restoreUser, requireAuth, async (req, res) => {
    let img = await SpotImage.findByPk(req.params.imageId, {
        include: [{model: Spot, include: [{model: User, attributes: ['id']}]}]
    });
    if (!img) {
        res.statusCode = 404;
        res.json({message: "Spot Image couldn't be found"})
    } else {
        let image = img.toJSON();
        if (req.user.id !== image.Spot.User.id) {
            res.statusCode = 403;
            res.json({message: "Forbidden"})
        } else {
            await img.destroy();
            res.statusCode = 200;
            res.json({message: "Successfully deleted"})
        }
    }
});

module.exports = router;
