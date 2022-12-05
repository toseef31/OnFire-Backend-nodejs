const express = require("express");
const authController = require("./../controllers/authController");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.get(
  "/getticket/:id",
  authController.protect,
  ticketController.getticket
);

router.get(
  "/getalluserticket",
  authController.protect,
  ticketController.getalluserticket
);

router.post(
  "/assignticket/:tid",
  authController.protect,
  ticketController.assignticket
);
router.post("/addticket", ticketController.addticket);
module.exports = router;
