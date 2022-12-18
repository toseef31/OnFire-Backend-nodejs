const mongoose = require("mongoose");
const Venue = require("./../models/venueModel");
//https://www.youtube.com/watch?v=bedqJstO5_c
const eventSchema = new mongoose.Schema(
  {
    eventimage: {
      type: String,
      required: [true, "A event must have a cover image"],
    },
    eventmenu: {
      type: String,
    },
    eventname: {
      type: String,
      required: [true, "A event must have a name"],
      trim: true,
      maxlength: [
        40,
        "A event name must have less or equal then 40 characters",
      ],
      minlength: [3, "A event name must have more or equal then 10 characters"],
    },
    Dates: [Date],
    venue: {
      type: Object,
    },
    eventcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    Tickets: { type: Boolean, default: false },
    food_servicepoints: { type: Boolean, default: false },
    servicepoint: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Servicepoint",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.pre("save", async function (next) {
  const venuesdetail = await Venue.findById(this.venue);
  this.venue = venuesdetail;
  next();
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
