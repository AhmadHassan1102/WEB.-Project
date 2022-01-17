const passport = require("passport");
// Load Role model
const Patient = require("../models/Patient");
const Role = require("../models/Role");
const Customer = require("../models/Customer");

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
exports.registerRole = (req, res) => {
    const { name, email, password, password2,bloodGroup,contactNo } = req.body;
    const role="customer"
    const donated="pending"
    let errors = [];
  
    if (!name || !email || !password || !password2||!bloodGroup||!contactNo) {
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
  
      res.redirect("/register");
    } 
    else {
      Role.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: "Email already exists" });
          req.flash("error_msg",errors[0].msg);
          res.redirect("/register");
        } else {
          const newCustomer = new Customer({
            name,
            email,
            password,
            bloodGroup,
            contactNo,
            bloodGroup,
            donated,
            role
          });
          const newRole = new Role({
            email,
            password,
            role
          });
          newRole.save();
          newCustomer.save();
          res.redirect("/login");
        }
      });
    }
  };

//Handle post request to Login a user
exports.loginRole = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
};

// Logout already logined user
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
};

exports.dashboard=(req, res) =>
res.render("dashboard", {
  role: req.user,
  layout: "layouts/layout"
})
exports.patientdashboard = (req, res) =>{
  if(req.user.role=="patient")
  {
      Patient.findOne({ email: req.user.email }).then(c => {
            res.render("customer", {
            customer: c,
            layout: "layouts/layout"
            })
          })
  }
  else
  {
    req.flash("error_msg", "You are not a customer");
    res.redirect("/dashboard");
  }   
}