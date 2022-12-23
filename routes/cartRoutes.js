const express = require("express");
const cartController = require("./../controllers/cartController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/additemincart", cartController.addincart);
router.get(
  "/getitemsincart/:pname",
  authController.protect,
  cartController.getallincart
);
router.get(
  "/getdistinctsp",
  authController.protect,
  cartController.getdistinctfs
);
router.patch("/updateitemincart/:id", cartController.updateincart);
router.delete("/deleteitemincart/:id", cartController.deleteincart);

module.exports = router;
