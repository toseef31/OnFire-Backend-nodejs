const express = require('express');
const venueController = require('./../controllers/venueController');

const router = express.Router();


router.get("/getall", venueController.getallnearvenues)
module.exports = router;
