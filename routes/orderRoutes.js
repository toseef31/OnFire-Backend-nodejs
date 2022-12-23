const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/create-checkout-session", orderController.getCheckoutSession);
module.exports = router;
