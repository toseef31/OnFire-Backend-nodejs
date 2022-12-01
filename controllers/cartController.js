const Cart = require("./../models/cartModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const QRCode = require("qrcode");
const { default: mongoose } = require("mongoose");

//add ticket
exports.addincart = catchAsync(async (req, res, next) => {
  const item = await Cart.create({
    userid: req.user.id,
    productname: req.body.productname,
    quantity: req.body.quantity,
    price: req.body.price,
    servicepointname: req.body.servicepointname,
  });

  res.status(201).json({
    status: "success",
    data: {
      product: item,
    },
  });
});

exports.getallincart = catchAsync(async (req, res, next) => {
  const item = await Cart.find({ userid: req.user.id });
  res.status(201).json({
    status: "success",
    data: {
      product: item,
    },
  });
});

exports.updateincart = catchAsync(async (req, res) => async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.deleteincart = catchAsync(async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
