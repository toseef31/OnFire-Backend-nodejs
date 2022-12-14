const express = require("express");
const eventController = require("./../controllers/eventController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/create", eventController.upload, eventController.createEvent);
router.get("/getevent/:id", eventController.getevent);
router.get("/getall", eventController.getallevents);
router.get("/getallbycatogry/:catid", eventController.geteventsbycategories);
router.get("/getallbycity", eventController.geteventsbycitycountry);
router.get("/getallbyvenue/:vid", eventController.geteventsofvenue);

module.exports = router;
