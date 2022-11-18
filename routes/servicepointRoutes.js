const express = require("express");
const servicepointController = require("../controllers/servicepointController");

const router = express.Router();

router.get("/getservicepoint/:id", servicepointController.getservicepoint);
//download service point menu
router.get("/downloadmenu/:filename", servicepointController.download);
module.exports = router;
