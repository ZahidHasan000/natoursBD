// const fs = require("fs");
const path = require('path');

const express = require("express");

const morgan = require("morgan");

const rateLimit = require('express-rate-limit');

const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const xss = require('xss-clean');

const hpp = require('hpp');

const cookieParser = require('cookie-parser');

const compression = require('compression');

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');

const reviewRouter = require('./routes/reviewRoutes');

const bookingRouter = require('./routes/bookingRoutes');

const viewRouter = require('./routes/viewRoutes');

//Start express app
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// (1) GLOBAL MIDDLEWARES
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: {
    allowOrigins: ['*']
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['*'],
      scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"]
    }
  }
})
);



// Development logging
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
};

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!'
});
app.use('/api', limiter);

// app.use(morgan('dev'));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (cross site scripting)
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingAverage',
    'ratingQuantity',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

// Serving static files
// app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log("Hello from the middleware");
//   next();
// });

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  // console.log(req.headers);
  // console.log(req.cookies);

  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;