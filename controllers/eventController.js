const Event = require('./../models/eventModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require("multer");
const moment = require("moment");
//file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "banners");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  exports.upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, next) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const mimeType = fileTypes.test(file.mimetype);
      if (mimeType) {
        return next(null, true);
      }
      return next(new AppError("Give a proper file format", 401));
    },
  }).single("myFile");



//this route is just to create 
exports.createEvent = catchAsync(async (req, res, next) => {

    req.body.eventimage=req.file.filename
    const newEvent = await Event.create(req.body);
    console.log(newEvent)
    res.status(201).json({
      status: 'success',
      data: {
        event: newEvent
      }
    });
  });


  //http://localhost:3000/api/v1/events/getevent/6373b4a1f7f043c9152152ba
  exports.getevent = catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
  
    if (!event) {
      return next(new AppError('No event found with that ID', 404));
    }

    // const dateform= moment(event.Dates).format('ddd DD-MMM-YYYY, hh:mm A')
    // const data= {event:event.eventname, Dates: dateform}
    
    res.status(200).json({
      status: 'success',
      data: {
        event
      }
    });
  });
  
//get all event //search event by event name //search event by event location
//http://localhost:3000/api/v1/events/getall?search=testevent2
//http://localhost:3000/api/v1/events/getall?search=testevent&page=1&limit=3

  exports.getallevents = catchAsync(async (req, res, next) => {
    const keyword = req.query.search? {
        $or: [
          { eventname: { $regex: req.query.search, $options: "i" } },
          { venuename: { $regex: req.query.search, $options: "i" } }
        ],
      }
    : {};

   req.query={keyword,...req.query}

    const features = new APIFeatures(Event.find().sort({Dates: 1}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let events = await features.query;

  res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events,
      }
    });
  });



  //get all events by their category
  //http://localhost:3000/api/v1/events/getallbycatogry?searchcategory=electronic
  exports.geteventsbycategories = catchAsync(async (req, res, next) => {
    const keyword = req.query.searchcategory? {
        $or: [
          { eventcategory: { $regex: req.query.searchcategory, $options: "i" } }
        ],
      }
    : {};
   
    req.query={keyword,...req.query}

    const features = new APIFeatures(Event.find().sort({Dates: 1}),   req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const events = await features.query;
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events
      }
    });
  });