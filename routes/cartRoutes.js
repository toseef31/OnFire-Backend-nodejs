const express = require("express");
const cartController = require("./../controllers/cartController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/additemincart", cartController.addincart);
router.get("/getitemsincart", cartController.getallincart);
router.put("/updateitemincart", cartController.updateincart);
router.delete("/deleteitemincart", cartController.deleteincart);

module.exports = router;
