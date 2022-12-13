// const express = require("express");
// const { crossOriginResourcePolicy } = require("helmet");
// const Stripe = require("stripe");
// const Ticket = require("./../models/ticketModel");
// const User = require("./../models/userModel");
// const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
// const QRCode = require("qrcode");
// const { default: mongoose } = require("mongoose");
// require("dotenv").config();

// const stripe = Stripe(process.env.STRIPE_KEY);

// const router = express.Router();

// router.post("/create-checkout-session");

// const createOrder = async (customer, data) => {
//   const customerdata = JSON.parse(customer.metadata.cart);
//   const User = "req.user.id";
//   let array = [];
//   for (let i = 0; i < customerdata.length; i++) {
//     const data = await QRCode.toDataURL(
//       "req.user.email + req.user._id + req.body[i].ticketname"
//     );
//     const html = `<div><img src="${data}"/></div>`;

//     customerdata[i].ticketqr = html;
//     customerdata[i].User = User;
//     array.push(customerdata[i]);
//   }
//   const datom = await Ticket.insertMany(array);
//   console.log(datom);
// };

// router.post(
//   "/webhook",
//   express.json({ type: "application/json" }),
//   async (req, res) => {
//     let data;
//     let eventType;
//     let webhookSecret;
//     if (webhookSecret) {
//       let event;
//       let signature = req.headers["stripe-signature"];
//       try {
//         event = stripe.webhooks.constructEvent(
//           req.body,
//           signature,
//           webhookSecret
//         );
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed:  ${err}`);
//         return res.sendStatus(400);
//       }
//       // Extract the object from the event.
//       data = event.data.object;
//       eventType = event.type;
//     } else {
//       // Webhook signing is recommended, but if the secret is not configured in `config.js`,
//       // retrieve the event data directly from the request body.
//       data = req.body.data.object;
//       eventType = req.body.type;
//     }

//     // Handle the checkout.session.completed event
//     if (eventType === "checkout.session.completed") {
//       stripe.customers
//         .retrieve(data.customer)
//         .then(async (customer) => {
//           try {
//             // CREATE ORDER
//             createOrder(customer, data);
//           } catch (err) {
//             console.log(err);
//           }
//         })
//         .catch((err) => console.log(err.message));
//     }

//     res.status(200).end();
//   }
// );

// module.exports = router;
