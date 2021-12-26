const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
// Load User Controller
const doctorController = require('../controllers/doctor.Controller');

// ShowData
router.get('/dashboard', ensureAuthenticated, doctorController.show);

module.exports = router;
