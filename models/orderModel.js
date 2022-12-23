//controller and routes of this model are in servicepoint
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    products: [
      {
        ItemId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        servicepointname: {
          type: String,
        },
      },
    ],
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
