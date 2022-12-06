const express = require('express');

const reviewController = require('./../controllers/reviewController');

const authController = require('./../controllers/authController');

// const router = express.Router();

const router = express.Router({ mergeParams: true });

// POST/tour/Id of tour/reviews
// GET/tour/Id of tour/reviews
// POST/reviews

router.use(authController.protect);

router.route('/')
  .get(reviewController.getAllReview)
  .post(authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview);

router.route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
  .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;