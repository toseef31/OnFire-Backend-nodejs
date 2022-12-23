//controller and routes of this model are in servicepoint
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    servicepointname: {
      type: String,
    },
    products: Array,
    status: { type: String, default: "pending" },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
