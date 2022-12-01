//controller and routes of this model are in servicepoint
const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    productname: {
      type: String,
    },
    quantity: {
      type: String,
    },
    price: {
      type: String,
    },
    servicepointname: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
