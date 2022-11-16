const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  
  const token = signToken(req.body.email);

  const newUser = await User.create({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    mobilenumber: req.body.mobilenumber,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    confirmationCode : token
  });
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/confirm/${newUser.confirmationCode}`;

  const  html= `<h1>OnFire Email Confirmation</h1>
  <h2>Hello ${newUser.name}</h2>
  <p>Thank you for onboard with ONfire. Please confirm your email by clicking on the following link</p>
  <a href=${resetURL}> Click here</a>
  <p>If you dont register account on Onfire feel free to ignore this mail</p>
  </div>`
  try {
    await sendEmail({
      email: newUser.email,
      subject: 'OnFire Account Verification Email',
      html
    });
  }
  catch (err) {
    console.log(err)
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }

  createSendToken(newUser, 200, res)

});



exports.verifyUser = async (req, res, next) => {
 const user= await User.findOne({
    confirmationCode: req.params.confirmationCode,
  }).select('+password')
  if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
  user.status = "VERIFIED";
  user.save({ validateBeforeSave: false });

    res.status(200).send({ message: "Account Verified." });
};



exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});


exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
     //to split the string and access 2nd word of string which is on index[1]
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});


exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
