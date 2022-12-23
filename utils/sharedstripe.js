const Stripe = require("stripe");
const ticketController = require("../controllers/ticketController");
const orderController = require("../controllers/orderController");

const stripe = Stripe(process.env.STRIPE_KEY);
const saveindb = async (customer, data) => {
  const customerdata = JSON.parse(customer.metadata.cart);
  if (customerdata[0].ticketname) {
    ticketController.saveticket(customer, data);
  } else {
    orderController.saveOrder(customer, data);
  }
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
          saveindb(customer, data);
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => console.log(err.message));
  }
  res.status(200).end();
};
