const passport = require("passport");
// Load User model
const Customer = require("../models/Customer");
//show Function
exports.show = (req, res) =>{
  if(req.user.role=="customer")
  {
      Customer.findOne({ email: req.user.email }).then(c => {
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

