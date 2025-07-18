if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js");
const session =require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")
const MongoStore=require('connect-mongo')

const dbUrl=process.env.ATLAS_URL;
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

  const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("Error in Mongo Session Store",err);
})
const sessionOptions = {
  store,
 secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 *1000,
    maxAge:7 * 24 * 60 * 60 *1000
  }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})





app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});


app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
