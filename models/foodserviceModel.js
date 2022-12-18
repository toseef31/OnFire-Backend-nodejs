//controller and routes of this model are in servicepoint
const mongoose = require("mongoose");
const foodserviceSchema = new mongoose.Schema(
  {
    fpointimage: {
      type: String,
    },
    fpointname: {
      type: String,
      unique: true,
    },
    fpointdescription: {
      type: String,
    },
    fpointcategory: {
      type: String,
      required: true,
    },
    fpointmenu: [
      {
        type: {
          type: String,
        },
        itemname: String,
        itemimage: String,
        category: {
          type: String,
          required: true,
        },
        price: Number,
        quantity: Number,
      },
    ],
    eventid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Foodservice = mongoose.model("Foodservice", foodserviceSchema);
module.exports = Foodservice;
