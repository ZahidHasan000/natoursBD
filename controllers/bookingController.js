const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require("./../models/tourModel");

const Booking = require("./../models/bookingModel");

const catchAsync = require('./../utils/catchAsync');

const factory = require('./handlerFactory');

const AppError = require('./../utils/appError');


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //(1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

    payment_method_types: ['card'],

    customer_email: req.user.email,
    client_reference_id: req.params.tourId,

    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            description: tour.summary
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1
      },
    ],
    mode: 'payment',

  });


  // (3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });

  // res.redirect(session)

});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //This is only temporary, because it's unsecure: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);

});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);