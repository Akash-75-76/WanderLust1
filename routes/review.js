const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");

// Create Review
router
  .route("/")
  .post(isLoggedIn, wrapAsync(reviewControllers.createReview));

// Delete Review
router
  .route("/:reviewId")
  .delete(isLoggedIn, isAuthor, wrapAsync(reviewControllers.deleteReview));

module.exports = router;
