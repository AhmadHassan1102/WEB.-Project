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
            res.render("Admin/doctorADD", {
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

  if (!name || !email || !password || !password2||!contactNo) {
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

exports.doctorDisplay  = (req, res) => {
  perPage=5;
  pageNo=req.params.page;
  if(pageNo==undefined)
  pageNo=1;
  Doctor.find(function(err, doctors)
   {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find students." });
    }
    if(doctors.length==0&&pageNo!=1)
    {
      req.flash("error_msg","Limit Exceded!!")
      res.redirect("/admin/DisplayDoctor/1");
      return;
    }
    if(doctors.length==0&&pageNo==1)
    {
      res.status(200).render("Admin/doctorDisplay", {
        doctors,
        total:doctors.length,
        error_msg:"Doctor not found!!",
        layout: "layouts/l"
      });
    }
   Doctor.find(function(err, doc)
    {
      res.status(200).render("Admin/doctorDisplay", {
        doctors,
        total:doc.length,
        layout: "layouts/l"
      });
    });
    
  }).limit(perPage).skip(perPage*(pageNo-1));
};

exports.doctorDelete  = (req, res) => {
  console.log(req.params.email)
  Doctor.deleteOne({ email: req.params.email },function(err){});
    Role.deleteOne({ email: req.params.email },function(err) {
      console.log("dkfhn");
      if (err) {
        req.flash("error_msg","Some thing went wrong");
        res.redirect("/admin/DisplayDoctor");
      }
      req.flash("success_msg","Doctor Deleted");
      res.redirect("/admin/DisplayDoctor");
    });  
};

exports.doctorDisplay1  = (req, res) => {
  console.log("hh");
  Doctor.findOne({ email: req.params.email })
    .then((doctor,err)=>{
      if (err) {
        console.log("hh");
        req.flash("error_msg","Some thing went wrong");
        res.redirect("/admin/DisplayDoctor");
        return;
      }
      console.log("hh");
      res.render("Admin/viewDoctor", {
        doctor,
        layout: "layouts/layout"
        })
    });
};

exports.SearchDoctor = (req, res) => {
  let s = new RegExp(req.body.id);
  Doctor.find({name:s})
  .then((doctors,err)=>{
    if (err) {
      return res
        .status(400)
        .json({err:"Oops somthing went wrong"});
    }
    if(doctors[0]==undefined)
    {
      req.flash("error_msg","Doctor not founded!!")
      res.redirect("/admin/DisplayDoctor");
      return;
    }
    res.render("Admin/doctorDisplay", {
      doctors,
      total:doc.length,
      success_msg:"Doctors founded!!",
      layout: "layouts/l"
    });
  })
};

//add doctor get
exports.UpdateGET = (req, res) =>{
  if(req.user.role=="Admin")
  {
      Doctor.find({email:req.params.email})
      .then((doctor,err)=>{
        if (err) {
          return res
            .status(400)
            .json({err:"Oops somthing went wrong"});
        }
        if(doctor[0]==undefined)
        {
          req.flash("error_msg","Doctor not founded!!")
          res.redirect("/admin/DisplayDoctor");
        }
        res.render("Admin/doctorUpdate", {
          admin: req.user,
          doctor:doctor[0],
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
exports.UpdatePOST = (req, res) =>{
  if(req.user.role=="Admin")
  {
    const { doctorname, doctoremail,doctorpassword, doctorpassword2,doctorcontactNo } = req.body;
    const role="doctor"
    let errors = [];
  
    if (!doctorname || !doctoremail || !doctorpassword || !doctorpassword2||!doctorcontactNo) {
      errors.push({ msg: "Please enter all fields" });
    }
  
    if (doctorpassword != doctorpassword2) {
      errors.push({ msg: "Passwords do not match" });
    }
  
    if (doctorpassword.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
  
    if (errors.length > 0) {
      req.flash("error_msg",errors[0].msg);
      const s="/admin/UpdateDoctor/"+req.params.doctor;
      res.redirect(s);
    } else {
      Role.find({ email: req.params.doctor }).then(user => 
     {
          const s={ password:doctorpassword, email:doctoremail,role,name:doctorname,contactNo:doctorcontactNo} 
          Doctor.updateOne({email:req.params.doctor},{ $set: s }, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          })
          Role.updateOne({_id:user[0]._id},{ $set: s }, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          })
          req.flash("success_msg","DoctorUpdated");
          res.redirect("/admin/DisplayDoctor");
      });
    }
  }
  else
  {
    req.flash("error_msg", "You are not a Admin");
    res.redirect("/dashboard");
  }   
}
