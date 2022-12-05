const Ticket = require("./../models/ticketModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const QRCode = require("qrcode");
const { default: mongoose } = require("mongoose");

//add ticket
exports.addticket = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tickets: tickets,
    },
  });
});

exports.getticket = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const tickets = await Ticket.find({
    "event._id": mongoose.Types.ObjectId(id),
  });
  res.status(200).json({
    status: "success",
    data: {
      tickets,
    },
  });
});

exports.assignticket = catchAsync(async (req, res, next) => {
  req.body.User = req.user.id;
  const ticket = await Ticket.create(req.body);
  console.log(typeof ticket.ticketquantity);
  res.status(200).json({
    status: "success",
    data: {
      ticket,
    },
  });
});

//get all tickets history of user
exports.getalluserticket = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.find({
    User: req.user.id,
  });
  res.status(200).json({
    status: "success",
    data: {
      tickets,
    },
  });
});
