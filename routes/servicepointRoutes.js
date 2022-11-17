const express = require("express");
const servicepointController = require("../controllers/servicepointController");

const router = express.Router();

router.get("/getallservicepoint", servicepointController.getallservicepoint);
module.exports = router;
