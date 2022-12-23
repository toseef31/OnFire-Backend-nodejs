const Order = require("./../models/servicepointModel");
const Stripe = require("stripe");
const catchAsync = require("./../utils/catchAsync");
const fs = require("fs");

/////////////////////////Stripe Implementation for tickets///////////////////////////////////////
const stripe = Stripe(process.env.STRIPE_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: "req.user.id",
      cart: JSON.stringify(req.body.cartItems),
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.itemname,
          description: `${item.pointname}`,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.itemprice * 100,
      },
      quantity: item.itemquantity,
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
  console.log(customerdata);
  //   const datom = await Ticket.insertMany(array);
  //   console.log(datom);
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
