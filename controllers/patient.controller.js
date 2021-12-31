const passport = require("passport");
// Load User model
const Admin = require("../models/Admin");
const Role = require("../models/Role");
const Customer = require("../models/Customer");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
//add patient get
exports.patientget = (req, res) =>{
    if(req.user.role=="Admin"||req.user.role=="doctor")
    {
              res.render("Patient/patientADD", {
              admin: req.user,
              layout: "layouts/layout"
              })
    }
    else
    {
      req.flash("error_msg", "You are not allowed here");
      res.redirect("/dashboard");
    }   
  }
  
  //add patient post
  exports.PatientPOST = (req, res) => {
    const { name, email, password, password2,contactNo,bloodGroup } = req.body;
    const role="patient"
    const acceptedOrNot="pending"
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
  
      res.redirect("/admin/ADDPatient");
    } else {
      Role.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: "Email already exists" });
          req.flash("error_msg",errors[0].msg);
          console.log("err");
          res.redirect("/admin/ADDPatient");
        } else {
          const newPatient = new Patient({
            name,
            email,
            password,
            contactNo,
            role,
            bloodGroup,
            acceptedOrNot
          });
          const newRole = new Role({
            email,
            password,
            role
          });
          newRole.save();
          newPatient.save();
          res.redirect("/admin/dashboard");
        }
      });
    }
  };
  
  exports.patientDisplay  = (req, res) => {
  
    Patient.find(function(err, patients) {
      if (err) {
        return res
          .status(400)
          .json({ err: "Oops something went wrong! Cannont find students." });
      }
      res.status(200).render("Patient/patientDisplay", {
        patients,
        layout: "layouts/l"
      });
    });
  };
  
  exports.patientDelete  = (req, res) => {
    Patient.deleteOne({ email: req.params.email },function(err) {
        if (err) {
          req.flash("error_msg","Some thing went wrong");
          res.redirect("/admin/DisplayPatient");
          return;
        }
      });  
      Role.deleteOne({ email: req.params.email },function(err) {
        if (err) {
          req.flash("error_msg","Some thing went wrong");
          res.redirect("/admin/DisplayPatient");
          return;
        }
        req.flash("success_msg","Patient Deleted");
        res.redirect("/admin/DisplayPatient");
      });  
  };
  
  exports.patientDisplay1  = (req, res) => {
    Patient.findOne({ email: req.params.email })
      .then((patient,err)=>{
        if (err) {
          req.flash("error_msg","Some thing went wrong");
          res.redirect("/admin/DisplayPatient");
        }
        res.render("Patient/viewPatient", {
          patient,
          layout: "layouts/layout"
          })
      });
  };
  
  exports.SearchPatient = (req, res) => {
    let s = new RegExp(req.body.id);
    Patient.find({name:s})
    .then((patients,err)=>{
      if (err) {
        return res
          .status(400)
          .json({err:"Oops somthing went wrong"});
      }
      if(patients[0]==undefined)
      {
        req.flash("error_msg","Patient not founded!!")
        res.redirect("/admin/DisplayPatient");
        return;
      }
      res.render("Patient/patientDisplay", {
        patients,
        success_msg:"Patients founded!!",
        layout: "layouts/l"
      });
    })
  };
  
  //add patient get
  exports.UpdateGET = (req, res) =>{
    if(req.user.role=="Admin"||req.user.role=="doctor")
    {
        Patient.find({email:req.params.email})
        .then((patient,err)=>{
          if (err) {
            return res
              .status(400)
              .json({err:"Oops somthing went wrong"});
          }
          console.log(patient[0]);
          console.log("ff");
          if(patient[0]==undefined)
          {
              console.log("ff");
            req.flash("error_msg","Patient not founded!!")
            res.redirect("/admin/DisplayPatient");
            return;
          }
          res.render("Patient/patientUpdate", {
            admin: req.user,
            patient:patient[0],
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
    if(req.user.role=="Admin"||req.user.role=="doctor")
    {
      const { patientname, patientemail,patientpassword, patientpassword2,patientcontactNo,patientbloodGroup } = req.body;
      const role="patient"
      let errors = [];
    
      if (!patientname || !patientemail || !patientpassword || !patientpassword2||!patientcontactNo) {
        errors.push({ msg: "Please enter all fields" });
      }
    
      if (patientpassword != patientpassword2) {
        errors.push({ msg: "Passwords do not match" });
      }
    
      if (patientpassword.length < 6) {
        errors.push({ msg: "Password must be at least 6 characters" });
      }
    
      if (errors.length > 0) {
        req.flash("error_msg",errors[0].msg);
        const s="/admin/UpdatePatient/"+req.params.patient;
        res.redirect(s);
      } else {
        Role.find({ email: req.params.patient }).then(user => 
       {
            const s={ password:patientpassword, email:patientemail,role,name:patientname,contactNo:patientcontactNo} 
            Patient.updateOne({email:req.params.patient},{ $set: s }, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
            })
            Role.updateOne({_id:user[0]._id},{ $set: s }, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
            })
            req.flash("success_msg","PatientUpdated");
            res.redirect("/admin/DisplayPatient");
        });
      }
    }
    else
    {
      req.flash("error_msg", "You are not a Admin");
      res.redirect("/dashboard");
    }   
  }

  exports.assign= (req, res) =>{
    if(req.user.role=="Admin"||req.user.role=="doctor")
    {   
        console.log(req.params.patient);
        Patient.find({ email: req.params.email }).then(P => 
       {
           console.log(P);
           if(P[0].acceptedOrNot!="pending")
           {
            req.flash("error_msg","Blood Already Injected");
            res.redirect("/admin/DisplayPatient");
           }
        Customer.find({ bloodGroup: P[0].bloodGroup }).then(C => 
            {
                if(C[0]==undefined)
                {
                    req.flash("error_msg","cannot find any donor with this blood group");
                    res.redirect("/admin/DisplayPatient");
                }
                else if(C[0].donated!="pending")
                {
                    req.flash("error_msg","cannot find any donor with this blood group");
                    res.redirect("/admin/DisplayPatient");
                }
                const s={ donated:P[0].name, acceptedOrNot:C[0].name} 
                Patient.updateOne({email:P[0].email},{ $set: s }, function(err, res) {
                  if (err) throw err;
                  console.log("1 document updated");
                })
                Customer.updateOne({email:C[0].email},{ $set: s }, function(err, res) {
                  if (err) throw err;
                  console.log("1 document updated");
                })
                req.flash("success_msg","PatientUpdated");
                res.redirect("/admin/DisplayPatient");
            });
        })
    }
    else
    {
      req.flash("error_msg", "You are not a Admin");
      res.redirect("/dashboard");
    }   
  }