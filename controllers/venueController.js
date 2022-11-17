const Venue = require("./../models/venueModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getallnearvenues = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitutr and longitude in the format lat,lng.",
        400
      )
    );
  }
  const distances = await Venue.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    //fields we want to show
    //   {
    //     $project: {
    //       distance: 1,
    //       name: 1
    //     }
    //   }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});
