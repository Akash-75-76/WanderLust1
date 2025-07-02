const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");

// Signup Route
router
  .route("/signup")
  .get(userControllers.renderSignup)
  .post(wrapAsync(userControllers.signup));

// Login Route
router
  .route("/login")
  .get(userControllers.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControllers.login
  );

// Logout Route
router.get("/logout", userControllers.logout);

module.exports = router;
