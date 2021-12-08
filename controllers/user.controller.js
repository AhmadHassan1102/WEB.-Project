const passport = require("passport");
// Load User model
const User = require("../models/User");

//Login Function
exports.login = (req, res) =>
  res.render("login", {
    layout: "layouts/layout"
  });

//Register Funcion
exports.register = (req, res) =>
  res.render("register", {
    layout: "layouts/layout"
  });

//Handle Post Request to add a new user
exports.registerUser = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    req.flash("error_msg",errors[0].msg);

    res.redirect("/users/register");
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        req.flash("error_msg",errors[0].msg);
        res.redirect("/users/register");
      } else {
        const newUser = new User({

          
          name,
          email,
          password
        });
        newUser.save();
      }
    });
  }
};

//Handle post request to Login a user
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
};

// Logout already logined user
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
};