const passport = require("passport");
// Load User model
const User = require("../models/Customer");
//show Function
exports.show = (req, res) =>
res.render("customer", {
  user: req.user,
  layout: "layouts/layout"
})
