const Servicepoint = require("./../models/servicepointModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const fs = require("fs");

exports.getservicepoint = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const servicepoint = await Servicepoint.findById(req.params.id);
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
