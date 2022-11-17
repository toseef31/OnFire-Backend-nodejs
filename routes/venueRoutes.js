const express = require("express");
const venueController = require("./../controllers/venueController");

const router = express.Router();

router.get("/distances/:latlng/unit/:unit", venueController.getallnearvenues);
module.exports = router;
