const Ticket = require("./../models/ticketModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Stripe = require("stripe");
const { default: mongoose } = require("mongoose");
const QRCode = require("qrcode");
require("dotenv").config();
/////////////////////////Stripe Implementation for tickets///////////////////////////////////////
const stripe = Stripe(process.env.STRIPE_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.user.id,
      cart: JSON.stringify(req.body.cartItems),
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.ticketname,
          images: [
            `${req.protocol}://${req.get("host")}/projectdata/eventspic/${
              item.event[0].eventimage
            }`,
          ],
          description: `${item.event[0].eventname}`,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.ticketquantity,
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${req.protocol}://${req.get("host")}`,
    cancel_url: `${req.protocol}://${req.get("host")}`,
  });

  // res.redirect(303, session.url);
  res.send({ url: session.url });
});

const createOrder = async (customer, data) => {
  const customerdata = JSON.parse(customer.metadata.cart);
  const User = customer.metadata.userId;
  let array = [];
  for (let i = 0; i < customerdata.length; i++) {
    const data = await QRCode.toDataURL(
      customerdata[i].ticketname + User + customerdata[i].event[0].eventname
    );
    const html = `<div><img src="${data}"/></div>`;

    customerdata[i].ticketqr = html;
    customerdata[i].User = User;
    array.push(customerdata[i]);
  }
  const datom = await Ticket.insertMany(array);
  console.log(datom);
};

exports.webhookCheckout = async (req, res) => {
  let data;
  let eventType;
  let webhookSecret;
  if (webhookSecret) {
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed:  ${err}`);
      return res.sendStatus(400);
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then(async (customer) => {
        try {
          // CREATE ORDER
          createOrder(customer, data);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => console.log(err.message));
  }
  res.status(200).end();
};
/////////////////End Of Stripe Implementation///////////////////////

//get tickets to show
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
