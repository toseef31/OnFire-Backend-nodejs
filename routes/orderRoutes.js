const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post(
  "/create-checkout-session",
  authController.protect,
  orderController.getCheckoutSession
);
router.get("/getorders", authController.protect, orderController.getOrderQue);
module.exports = router;
