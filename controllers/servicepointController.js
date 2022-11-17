const Servicepoint = require("./../models/servicepointModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.getallservicepoint = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Servicepoint.find().sort({ Dates: 1 }),
    req.query
  )
    .sort()
    .limitFields()
    .paginate();
  let servicepoint = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      servicepoint,
    },
  });
});

// exports.download = (req, res, next) => {
//   console.log("fileController.download: started  " + req.params.asname);
//   const path = `txtfiles/${req.params.asname}`;
//   const file = fs.createReadStream(path);
//   const filename = new Date().toISOString();
//   res.setHeader(
//     "Content-Disposition",
//     'attachment: filename="' + filename + '"'
//   );
//   file.pipe(res);
// };
