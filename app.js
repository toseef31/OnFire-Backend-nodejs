const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const venueRouter = require("./routes/venueRoutes");
const servicepointRouter = require("./routes/servicepointRoutes");
const ticketRouter = require("./routes/ticketRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const paypalRouter = require("./routes/paypalRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const stripewebhook = require("./utils/sharedstripe");

const cors = require("cors");
const app = express();
app.use(helmet());

app.use(
  cors({
    origin: "*",
  })
);

// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });

// app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());

//this is to avoid parameter polution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

//http://localhost:3000/projectdata/banners/banner.png
app.use("/projectdata", express.static("projectdata"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/venues", venueRouter);
app.use("/api/v1/service", servicepointRouter);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/paypal", paypalRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/saveindb", stripewebhook.webhookCheckout);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
