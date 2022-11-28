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
  console.log(req.params.id);
  const id = req.params.id + "";
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

//we have to take my ticket from request
exports.assignticket = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  const user = await User.findByIdAndUpdate(req.user.id, {
    $push: {
      MyTicket: "637e03fc6b858d577e858426",
    },
  }).populate("MyTicket");

  const MyTicket = user.MyTicket;
  res.status(200).json({
    status: "success",
    data: {
      MyTicket,
    },
  });
});
