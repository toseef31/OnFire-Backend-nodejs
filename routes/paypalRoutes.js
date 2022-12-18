const express = require("express");
const paypal = require("paypal-rest-sdk");
const QRCode = require("qrcode");
const Ticket = require("../models/ticketModel");
const authController = require("../controllers/authController");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AR6424W1tBT3JXp4K2UWfYNLM2y7pUo4071TwXUAERz0hBN33NUrvhmfl8Q1EYTCzd2-M5xSyzS_3zip",
  client_secret:
    "EI6OlFPyicOi2PtGbPdEy49oJY3HKQFxVGaN7OHtmqGYyyJYPMtNDZqP0-PFNTIcYJ30RZXwZ5ox0iFG",
});

const router = express.Router();

router.post("/pay", async (req, res) => {
  {
    req.body.cartItems = [
      {
        ticketname: "General Parking",
        price: 12,
        event: [
          {
            _id: "638ed87ff85c1fde2ea98186",
            eventimage: "1670305932008banner.png",
            eventname: "test event 1",
          },
        ],
        status: "UNVALIDATED",
        ticketquantity: 1,
      },
      {
        ticketname: "General Admission",
        price: 2,
        event: [
          {
            _id: "638ed87ff85c1fde2ea98186",
            eventimage: "1669985159710banner.png",
            eventname: "test event 2",
          },
        ],
        status: "UNVALIDATED",
        ticketquantity: 3,
      },
    ];
    let total = 0;
    let array = [];
    for (let i = 0; i < req.body.cartItems.length; i++) {
      const data = await QRCode.toDataURL(
        `req.body.cartItems[i].ticketname +
          User +
          req.body.cartItems[i].event[0].eventname`
      );
      const html = `<div><img src="${data}"/></div>`;
      total =
        total +
        req.body.cartItems[i].price * req.body.cartItems[i].ticketquantity;
      req.body.cartItems[i].ticketqr = html;
      req.body.cartItems[i].User = "User";
      array.push(req.body.cartItems[i]);
    }

    console.log(total);

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${req.protocol}://${req.get(
          "host"
        )}/api/v1/paypal/success`,
        cancel_url: "http://localhost:3000/cancel",
      },
      transactions: [
        {
          item_list: {
            items: array.map((item) => {
              return {
                name: item.ticketname,
                sku: "001",
                price: item.price,
                currency: "USD",
                quantity: item.ticketquantity,
              };
            }),
          },
          amount: {
            currency: "USD",
            total: total,
          },
          description: "You are paying for tickets",
        },
      ],
    };

    router.get("/success", (req, res) => {
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;
      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: total,
            },
          },
        ],
      };

      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        async function (error, payment) {
          if (error) {
            console.log(error.response);
            throw error;
          } else {
            const datom = await Ticket.insertMany(array);
            console.log(datom);
            res.send("Successfull hogay aap");
          }
        }
      );
    });

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  }
});

module.exports = router;
