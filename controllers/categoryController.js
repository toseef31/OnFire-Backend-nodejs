const Category = require("./../models/categoryModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const QRCode = require("qrcode");
const { default: mongoose } = require("mongoose");

//add ticket
exports.addcategory = catchAsync(async (req, res, next) => {
  let category = new Category({
    name: req.body.name,
    subcategories: req.body.subcategories,
  });
  category = await category.save();

  if (!category) return res.status(400).send("the category cannot be created!");

  res.send(category);
});
//https://www.youtube.com/watch?v=juPYfVY6jkQ&list=PLzb46hGUzitBp584kLyn6l3i6yC-rXlmN&index=4
exports.getcategory = catchAsync(async (req, res, next) => {
  const categoryList = await Category.find({
    name: req.params.name,
  });

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});
