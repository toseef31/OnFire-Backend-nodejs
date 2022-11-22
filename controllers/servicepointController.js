const Servicepoint = require("./../models/servicepointModel");
const Foodservice = require("./../models/foodserviceModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const fs = require("fs");

exports.getservicepoint = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const servicepoint = await Servicepoint.findById(
    req.params.id,
    "pointimage pointname pointmenu"
  );
  console.log(servicepoint);
  res.status(200).json({
    status: "success",
    data: {
      servicepoint,
    },
  });
});

//get food servicepoint
exports.getfoodservicepoint = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const servicepoint = await Servicepoint.findById(
    req.params.id,
    "food_servicepoints"
  ).populate("food_servicepoints");
  console.log(servicepoint);
  res.status(200).json({
    status: "success",
    data: {
      servicepoint,
    },
  });
});

//http://localhost:3000/api/v1/service/downloadmenu/foodmenu.pdf
exports.download = (req, res, next) => {
  console.log("fileController.download: started  " + req.params.filename);
  const path = `projectdata/menupdf/${req.params.filename}`;
  const file = fs.createReadStream(path);
  const filename = new Date().toISOString();
  res.setHeader(
    "Content-Disposition",
    'attachment: filename="' + filename + '"'
  );
  file.pipe(res);
};

//geting foodservicepoint by categories //we have to add fpointcategorie in food model

{
  ("this route is not yet implemented");
}

//geting foodservicepoint menu by categories
exports.foodmenubycategory = catchAsync(async (req, res, next) => {
  const fservicepoint = await Foodservice.findById(req.params.id);
  let obj = fservicepoint.fpointmenu.filter((e) => e.category === "pizza");

  res.status(200).json({
    status: "success",
    data: {
      obj,
    },
  });
});

//getting servicepoint menu on basis of different categories
exports.menubycategory = catchAsync(async (req, res, next) => {
  const servicepoint = await Servicepoint.findById(req.params.id);
  let obj = servicepoint.pointmenu.find((e) => e.category === "desifood");
  res.status(200).json({
    status: "success",
    data: {
      obj,
    },
  });
});
