const express = require("express");
const categoryController = require("./../controllers/categoryController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/addcategory", categoryController.addcategory);
router.get("/getcategories/:name", categoryController.getcategory);

module.exports = router;
