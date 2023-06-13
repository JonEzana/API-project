const express = require('express');

const { Spot } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('', async (req, res) => {
    const allSpots = await Spot.findAll();
    const Spots = allSpots.map(spot => spot.toJSON())
    res.json({Spots});
})


module.exports = router;
