const mongoose = require("mongoose");
const Event = require("./../models/eventModel");
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
    event: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
      required: true,
    },
    status: { type: String, default: "UNVALIDATED" },
    Dates: { type: Date },
    ticketquantity: { type: Number, default: 0 },
    ticketdescription: {
      type: String,
    },
    ticketqr: {
      type: String,
    },
    User: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ticketSchema.pre(/^find/, function (next) {
  this.populate({
    path: "event",
    select: "eventname eventimage",
  });
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
