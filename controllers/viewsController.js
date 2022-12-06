const Tour = require('./../models/tourModel');

const User = require('./../models/userModel');

const Booking = require("./../models/bookingModel");

const catchAsync = require('./../utils/catchAsync');

const AppError = require('./../utils/appError');

// exports.getOverview = (req, res) => {
exports.getOverview = catchAsync(async (req, res, next) => {
  // (1) Get all tour data from collection
  const tours = await Tour.find();

  // (2) Build template

  // (3) Rendered that template using tour data from step-1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // (1) Get the data, for the requested tour (includ in reviews & guide)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review, rating, user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // (2) Build template

  // (3) render template using data from step-(1)

  res.status(200)
    // Any securty reason forn attach a map so use this[.set()]

    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'signup into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('userAccount', {
    title: 'Your account'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //(1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  //(2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });

});

exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log('UPDATING DATA', req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('userAccount', {
    title: 'Your account',
    user: updatedUser
  });
});

