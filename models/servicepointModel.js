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
        category: String,
        price: Number,
      },
    ],
    food_servicepoints: [
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
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Servicepoint = mongoose.model("Servicepoint", servicepointSchema);
module.exports = Servicepoint;
