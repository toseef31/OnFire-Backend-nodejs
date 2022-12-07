const Servicepoint = require("./../models/servicepointModel");
const Foodservice = require("./../models/foodserviceModel");

const catchAsync = require("./../utils/catchAsync");
const fs = require("fs");
//get general service point
exports.getservicepoint = catchAsync(async (req, res, next) => {
  const servicepoint = await Servicepoint.findById(
    req.params.id,
    "pointimage pointname pointmenu"
  );
  res.status(200).json({
    status: "success",
    data: {
      servicepoint,
    },
  });
});

//get food servicepoint
exports.getfoodservicepoint = catchAsync(async (req, res, next) => {
  const servicepoint = await Servicepoint.findById(
    req.params.id,
    "food_servicepoints"
  ).populate("food_servicepoints");
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

//geting foodservicepoint menu by categories
exports.foodmenubycategory = catchAsync(async (req, res, next) => {
  const fservicepoint = await Foodservice.findById(req.params.id);
  let obj = fservicepoint.fpointmenu.filter(
    (e) => e.category == req.params.catid
  );
  res.status(200).json({
    status: "success",
    data: {
      obj,
    },
  });
});

//get food point on basis of category// there is difference between fpointmenucategories
// and fpointcategories
exports.foodpointsbycategory = catchAsync(async (req, res, next) => {
  const fservicepoint = await Foodservice.find({
    fpointcategory: req.params.catid,
  });
  res.status(200).json({
    status: "success",
    data: {
      fservicepoint,
    },
  });
});

//getting servicepoint menu on basis of different categories
exports.menubycategory = catchAsync(async (req, res, next) => {
  const servicepoint = await Servicepoint.findById(req.params.id);
  let obj = servicepoint.pointmenu.filter(
    (e) => e.category === req.params.catid
  );
  res.status(200).json({
    status: "success",
    data: {
      obj,
    },
  });
});
