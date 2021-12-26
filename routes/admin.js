const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
// Load User Controller
const adminController = require('../controllers/admin.controller');

// ShowData
router.get('/dashboard', ensureAuthenticated, adminController.show);

router.get('/ADDDoctor', ensureAuthenticated, adminController.doctorget);

router.post('/ADDDoctor', ensureAuthenticated, adminController.DoctorPOST);

module.exports = router;
