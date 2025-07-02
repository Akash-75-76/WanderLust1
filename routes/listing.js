const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
//index route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
 const listing = await Listing.findById(req.params.id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
  .populate("owner");


    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    console.log(listing);
  res.render("listings/show.ejs", { listing });
});

//Create route

router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    const newListings = new Listing(req.body.listing);
    newListings.owner=req.user._id;
    await newListings.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
  })
);

//Edit route
router.get("/:id/edit", isLoggedIn,isOwner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
router.put("/:id", isLoggedIn,isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success","Listing updated");
  return res.redirect(`/listings/${id}`);
});

router.delete("/:id", isLoggedIn,isOwner, async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

module.exports = router;
