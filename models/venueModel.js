const mongoose = require("mongoose");
//https://www.youtube.com/watch?v=bedqJstO5_c
const venueSchema = new mongoose.Schema(
  {
    venueimage: {
      type: String,
      required: [true, "A event must have a cover image"],
    },
    venuename: {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

venueSchema.index({ Location: "2dsphere" });

const Venue = mongoose.model("Venue", venueSchema);
module.exports = Venue;
