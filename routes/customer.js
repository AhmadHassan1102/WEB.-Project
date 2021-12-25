const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
// Load User Controller
const customerController = require('../controllers/customer.Controller');

// ShowData
router.get('/dashboard', ensureAuthenticated, customerController.show);

module.exports = router;
