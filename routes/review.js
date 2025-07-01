const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js")
const Review = require("../models/review.js");


//Post Route

router.post("/",wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review created")
    res.redirect(`/listings/${listing._id}`);

}))

//Delete review 

router.delete("/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review deleted")
  res.redirect(`/listings/${id}`);
}));

module.exports=router;