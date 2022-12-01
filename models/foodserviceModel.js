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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    fpointmenu: [
      {
        type: {
          type: String,
        },
        itemname: String,
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
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
