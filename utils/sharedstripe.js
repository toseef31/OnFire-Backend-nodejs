const Stripe = require("stripe");
const createOrder = async (customer, data) => {
  const customerdata = JSON.parse(customer.metadata.cart);
  // const User = customer.metadata.userId;
  // let array = [];
  // for (let i = 0; i < customerdata.length; i++) {
  //   const data = await QRCode.toDataURL(
  //     customerdata[i].ticketname + User + customerdata[i].event[0].eventname
  //   );
  //   const html = `<div><img src="${data}"/></div>`;

  //   customerdata[i].ticketqr = html;
  //   customerdata[i].User = User;
  //   array.push(customerdata[i]);
  // }
  // const datom = await Ticket.insertMany(array);
  console.log(customerdata);
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
