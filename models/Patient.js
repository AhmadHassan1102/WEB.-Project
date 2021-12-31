const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
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
  acceptedOrNot: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
});

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
