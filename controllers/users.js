const User=require("../models/user");


module.exports.renderSignup= (req, res) => {
  res.render("users/login.ejs");
}


module.exports.signup=(async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to wanderlust");
        res.redirect("/listings");
    })
    
    
  })

  module.exports.renderLoginForm= (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login=(req, res) => {
    req.flash("success", "Welcome back to wanderlust");
    res.redirect(res.locals.redirectUrl || "/listings");
  }


module.exports.logout=(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
       return  next(err)
    }
    req.flash("success","You are logged out");
    res.redirect("/listings");
  })
}