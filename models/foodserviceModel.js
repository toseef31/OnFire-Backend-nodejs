//controller and routes of this model are in servicepoint
const mongoose = require("mongoose");
const foodserviceSchema = new mongoose.Schema(
  {
    fpointimage: {
      type: String,
    },
    fpointname: {
      type: String,
    },
    fpointdescription: {
      type: String,
    },
    fpointcategory: {
      type: String,
    },
    fpointmenu: [
      {
        type: {
          type: String,
        },
        itemname: String,
        category: String,
        price: Number,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Foodservice = mongoose.model("Foodservice", foodserviceSchema);
module.exports = Foodservice;
