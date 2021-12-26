const passport = require("passport");
// Load User model
const Admin = require("../models/Admin");
const Role = require("../models/Role");
const Doctor = require("../models/Doctor");
//show Function
exports.show = (req, res) =>{
  if(req.user.role=="Admin")
  {
        Admin.findOne({ email: req.user.email }).then(a => {
            res.render("Admin/admin", {
            admin: a,
            layout: "layouts/layout"
            })
          })
  }
  else
  {
    req.flash("error_msg", "You are not a Admin");
    res.redirect("/dashboard");
  }   
}

//add doctor get
exports.doctorget = (req, res) =>{
  if(req.user.role=="Admin")
  {
            res.render("Admin/doctor", {
            admin: req.user,
            layout: "layouts/layout"
            })
  }
  else
  {
    req.flash("error_msg", "You are not a Admin");
    res.redirect("/dashboard");
  }   
}

//add doctor post
exports.DoctorPOST = (req, res) => {
  const { name, email, password, password2,contactNo } = req.body;
  const role="doctor"
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
    console.log("rrr");
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    req.flash("error_msg",errors[0].msg);

    res.redirect("/admin/ADDDoctor");
  } else {
    Role.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        req.flash("error_msg",errors[0].msg);
        console.log("err");
        res.redirect("/admin/ADDDoctor");
      } else {
        const newDoctor = new Doctor({
          name,
          email,
          password,
          contactNo,
          role
        });
        const newRole = new Role({
          email,
          password,
          role
        });
        newRole.save();
        newDoctor.save();
        res.redirect("/admin/dashboard");
      }
    });
  }
};



