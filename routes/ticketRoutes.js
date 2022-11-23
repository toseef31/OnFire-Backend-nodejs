const express = require("express");
const authController = require("./../controllers/authController");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.get("/getticket/:id", ticketController.getticket);
router.patch(
  "/assignticket",
  authController.protect,
  ticketController.assignticket
);

module.exports = router;
