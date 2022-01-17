const passport = require("passport");
// Load User model
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");
const Role = require("../models/Role");
const Doctor = require("../models/Doctor");
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

exports.customerDisplay  = (req, res) => {
  perPage=5;
  pageNo=req.params.page;
  if(pageNo==undefined)
  pageNo=1;
  Customer.find(function(err, customers) {
    if (err) {
      return res
        .status(400)
        .json({ err: "Oops something went wrong! Cannont find students." });
    }
    if(customers.length==0&&pageNo!=1)
    {
      req.flash("error_msg","Limit Exceded!!")
      res.redirect("/customer/DisplayCustomer/1");
      return;
    }
    if(customers.length==0&&pageNo==1)
    {
      res.status(200).render("Admin/customerDisplay", {
        customers,
        error_msg:"Customer not Founded!!",
        total:customers.length,
        layout: "layouts/l"
      });
      return;
    }
    Customer.find(function(err, cus)
    {
      res.status(200).render("Admin/customerDisplay", {
        customers,
        total:cus.length,
        layout: "layouts/l"
      });
    });
  }).limit(perPage).skip(perPage*(pageNo-1));
};

exports.customerDelete  = (req, res) => {
  console.log(req.params.email)
  Customer.deleteOne({ email: req.params.email },function(err){});
    Role.deleteOne({ email: req.params.email },function(err) {
      if (err) {
        req.flash("error_msg","Some thing went wrong");
        res.redirect("/customer/DisplayCustomer");
        return;
      }
      req.flash("success_msg","Customer Deleted");
      res.redirect("/customer/DisplayCustomer");
    });  
};

exports.customerDisplay1  = (req, res) => {
  console.log("hh");
  Customer.findOne({ email: req.params.email })
    .then((customer,err)=>{
      if (err) {
        console.log("hh");
        req.flash("error_msg","Some thing went wrong");
        res.redirect("/customer/DisplayCustomer");
        return;
      }
      console.log("hh");
      res.render("Admin/viewCustomer", {
        customer,
        layout: "layouts/layout"
        })
    });
};

exports.SearchCustomer = (req, res) => {
  let s = new RegExp(req.body.id);
  Customer.find({name:s})
  .then((customers,err)=>{
    if (err) {
      return res
        .status(400)
        .json({err:"Oops somthing went wrong"});
    }
    if(customers[0]==undefined)
    {
      req.flash("error_msg","Customer not founded!!")
      res.redirect("/customer/DisplayCustomer");
      return;
    }
    res.render("Admin/customerDisplay", {
      customers,
      total:customers.length,
      success_msg:"Customers founded!!",
      layout: "layouts/l"
    });
  })
};

//add customer get
exports.UpdateGET = (req, res) =>{
  if(req.user.role=="Admin")
  {
      Customer.find({email:req.params.email})
      .then((customer,err)=>{
        if (err) {
          return res
            .status(400)
            .json({err:"Oops somthing went wrong"});
        }
        if(customer[0]==undefined)
        {
          req.flash("error_msg","Customer not founded!!")
          res.redirect("/customer/DisplayCustomer");
          return;
        }
        res.render("Admin/customerUpdate", {
          admin: req.user,
          customer:customer[0],
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
    const { customername, customeremail,customerpassword, customerpassword2,customercontactNo } = req.body;
    const role="customer"
    const acceptedOrNot="pending"
    let errors = [];
  
    if (!customername || !customeremail || !customerpassword || !customerpassword2||!customercontactNo) {
      errors.push({ msg: "Please enter all fields" });
    }
  
    if (customerpassword != customerpassword2) {
      errors.push({ msg: "Passwords do not match" });
    }
  
    if (customerpassword.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
  
    if (errors.length > 0) {
      req.flash("error_msg",errors[0].msg);
      const s="/customer/UpdateCustomer/"+req.params.customer;
      res.redirect(s);
    } else {
      Role.find({ email: req.params.customer }).then(user => 
     {
          const s={ password:customerpassword, email:customeremail,role,name:customername,contactNo:customercontactNo} 
          Customer.updateOne({email:req.params.customer},{ $set: s }, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          })
          Role.updateOne({_id:user[0]._id},{ $set: s }, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          })
          req.flash("success_msg","CustomerUpdated");
          res.redirect("/customer/DisplayCustomer");
      });
    }
  }
  else
  {
    req.flash("error_msg", "You are not a Admin");
    res.redirect("/dashboard");
  }   
}
