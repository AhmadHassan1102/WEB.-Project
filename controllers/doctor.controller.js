const passport = require("passport");
// Load User model
const Doctor = require("../models/Doctor");
//show Function
exports.show = (req, res) =>{
  if(req.user.role=="doctor")
  {
            Doctor.findOne({ email: req.user.email }).then(d => {
            res.render("Doctor", {
            doctor: d,
            layout: "layouts/layout"
            })
          })
  }
  else
  {
    req.flash("error_msg", "You are not a Doctor");
    res.redirect("/dashboard");
  }   
}

