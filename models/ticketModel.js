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
    event: Array,
    status: { type: String, default: "UNVALIDATED" },
    Dates: { type: Date },
    ticketquantity: { type: Number, default: 1 },
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

ticketSchema.pre("save", async function (next) {
  const eventsPromises = this.event.map(
    async (id) => await Event.findById(id).select("eventname eventimage ")
  );
  this.event = await Promise.all(eventsPromises);
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
