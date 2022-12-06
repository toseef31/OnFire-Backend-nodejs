const Venue = require("./../models/venueModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

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

exports.getallvenues = catchAsync(async (req, res, next) => {
  const venue = await Venue.find();

  res.status(200).json({
    status: "success",
    data: {
      data: venue,
    },
  });
});

exports.getvenuesbycitycountry = catchAsync(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            "Location.description": {
              $regex: req.query.search,
              $options: "i",
            },
          },
        ],
      }
    : {};
  req.query = { keyword, ...req.query };
  const features = new APIFeatures(Venue.find(), req.query).filter();
  let venues = await features.query;
  res.status(200).json({
    status: "success",
    results: venues.length,
    data: {
      venues,
    },
  });
});
