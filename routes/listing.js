const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js")

//index route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
});

//Create route

router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    let result=listingSchema.validate(req.body);
    if(result.error){
      throw  new ExpressError(400,result.error);
    }
    const newListings = new Listing(req.body.listing);
    await newListings.save();
    res.redirect("/listings");
  })
);

//Edit route
router.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
router.put("/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});


module.exports=router;