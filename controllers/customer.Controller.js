const passport = require("passport");
// Load User model
const Customer = require("../models/Customer");
//show Function
exports.show = (req, res) =>{
  Customer.findOne({ email: req.user.email }).then(c => {
            res.render("customer", {
            customer: c,
            layout: "layouts/layout"
            })
          })
        }

