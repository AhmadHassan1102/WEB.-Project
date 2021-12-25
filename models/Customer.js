const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
