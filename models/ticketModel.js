const mongoose = require("mongoose");
//https://www.youtube.com/watch?v=bedqJstO5_c
const ticketSchema = new mongoose.Schema(
  {
    ticketname: {
      type: String,
      required: [true, "A ticket must have a ticket name"],
    },
    price: {
      type: Number,
    },
    eventid: {
      type: String,
      required: [true, "A ticket must created for a event"],
    },
    Dates: { type: Date },
    ticketdescription: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
