const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const QRCode = require('qrcode')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };


exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'surname', 'mobilenumber');
  
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });

  exports.getprofiledata =catchAsync(async (req, res, next) => {
    let profiledata = await User.findById(req.user._id);
    
    if (!profiledata) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: profiledata
      }
    });
  });


  exports.generateQR = (async (req, res , next) => {
    console.log(req.user)
    try {
      const data= await QRCode.toDataURL(req.user.email+" "+req.user._id)
      const  html= `<div><img src="${data}"/></div>`

      res.send(html)

    } catch (err) {
      console.error(err)
    }
  });