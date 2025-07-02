const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

// INDEX & CREATE
router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(isLoggedIn, wrapAsync(listingControllers.createListing));

// NEW FORM
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

// SHOW, UPDATE, DELETE
router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing))
  .put(isLoggedIn, isOwner, listingControllers.updateListing)
  .delete(isLoggedIn, isOwner, listingControllers.destroyListing);

// EDIT FORM
router.get("/:id/edit", isLoggedIn, isOwner, listingControllers.renderEditForm);

module.exports = router;
