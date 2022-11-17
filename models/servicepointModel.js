const mongoose = require("mongoose");
const servicepointSchema = new mongoose.Schema(
  {
    pointimage: {
      type: String,
    },
    pointname: {
      type: String,
      required: [true, "A servicepoint must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A event name must have less or equal then 40 characters",
      ],
      minlength: [3, "A point name must have more or equal then 10 characters"],
    },
    pointmenu: [
      {
        type: {
          type: String,
        },
        itemname: String,
        price: Number,
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
