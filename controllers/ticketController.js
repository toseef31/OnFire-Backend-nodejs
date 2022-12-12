const Ticket = require("./../models/ticketModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const QRCode = require("qrcode");
const { default: mongoose } = require("mongoose");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const ticket = await Ticket.findById(req.params.tid);
  // console.log(tour);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get("host")}/my-tours`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_id: req.user.id,
    client_reference_id: req.params.tid,
    line_items: [
      {
        //
        name: `${ticket.name} Tour`,
        description: ticket.event[0].eventname,
        images: [
          `${req.protocol}://${req.get("host")}/pro/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

//add ticket not used in app
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
  const User = req.user.id;
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
