const mongoose = require("mongoose");
const servicepointSchema = new mongoose.Schema(
  {
    pointimage: {
      type: String,
    },
    pointname: {
      type: String,
    },
    pointmenu: [
      {
        type: {
          type: String,
        },
        itemname: String,
        itemimage: String,
        category: String,
        price: Number,
        quantity: Number,
      },
    ],
    food_servicepoints: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Foodservice",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Servicepoint = mongoose.model("Servicepoint", servicepointSchema);
module.exports = Servicepoint;
