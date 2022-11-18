const mongoose = require("mongoose");
//https://www.youtube.com/watch?v=bedqJstO5_c
const eventSchema = new mongoose.Schema(
  {
    eventimage: {
      type: String,
      required: [true, "A event must have a cover image"],
    },
    eventname: {
      type: String,
      required: [true, "A event must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A event name must have less or equal then 40 characters",
      ],
      minlength: [3, "A event name must have more or equal then 10 characters"],
    },
    Dates: { type: Date },
    venuename: {
      type: String,
      required: [true, "A event must have a venue"],
    },
    Location: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    eventcategory: {
      type: String,
      required: [true, "A event must have a venue"],
    },
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

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
