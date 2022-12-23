const Order = require("./../models/servicepointModel");
const Stripe = require("stripe");
const catchAsync = require("./../utils/catchAsync");
const fs = require("fs");
const { response } = require("../app");

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

exports.saveOrder = async (customer, data) => {
  console.log("in order");
  const customerdata = JSON.parse(customer.metadata.cart);
  const order = await Order.create({
    User: customer.metadata.userId,
    servicepointname: customerdata[0].pointname,
    products: [customerdata.cartItems],
    status: "pending",
  });
  console.log(order);
};

/////////////////End Of Stripe Implementation///////////////////////
