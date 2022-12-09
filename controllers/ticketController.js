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
  console.log(tickets);
  let arr = [];
  tickets.forEach((element) => {
    if (element.User == null) {
      console.log(tickets.User);
      arr.push(element);
    }
  });

  res.status(200).json({
    status: "success",
    data: {
      arr,
    },
  });
});

exports.assignticket = catchAsync(async (req, res, next) => {
  req.body.User = req.user.id;
  const data = await QRCode.toDataURL(
    req.user.email + req.user._id + req.body.ticketname
  );
  const html = `<div><img src="${data}"/></div>`;
  req.body.ticketqr = html;
  const ticket = await Ticket.create(req.body);
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
      tickets: tickets,
    },
  });
});
