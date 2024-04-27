const User = require("../models/user.js");

// Login Validation
module.exports.isLoggedIn = (req, res, next) => {
  console.log(`Current User :- ${req.user}`);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to proceed!");
    return res.redirect("/student/login");
  }
  next();
};

// Saving source URL
module.exports.saveRedirectUrl = async (req, res, next) => {
  try {
    if (!req.session.redirectUrl) {
      console.log(`Invalid Redirect URL:- ${req.session.redirectUrl}`);
      throw new Error();
    }
    let url = `${req.protocol}://${req.get("host")}${req.session.redirectUrl}`;
    console.log(`URL : ${url}`);
    const response = await fetch(url);
    if (response.status < 400) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
  } catch (err) {
    res.locals.redirectUrl = "/listings";
  }
  next();
};

// Admin Validation
module.exports.isAdmin = async (req, res, next) => {
  let { id } = req.locals.currUser._id;
  let user = await User.findById(id);
  console.log(`Current user ID : ${id}`);
  if (user.role !== 1) {
    req.flash(
      "error",
      "This account is not an Admin Account! Please login as Admin"
    );
    return res.redirect(`/admin/login`);
  }
  next();
};