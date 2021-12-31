const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
// Load User Controller
const customerController = require('../controllers/customer.Controller');

// ShowData
router.get('/dashboard', ensureAuthenticated, customerController.show);


router.get('/DisplayCustomer/', ensureAuthenticated, customerController.customerDisplay);

router.get('/DisplayDelete/:email', ensureAuthenticated, customerController.customerDelete);

router.get('/ViewCustomer/:email', ensureAuthenticated, customerController.customerDisplay1);

router.post('/SearchCustomer', ensureAuthenticated, customerController.SearchCustomer);

router.post('/UpdateCustomer/:customer', ensureAuthenticated, customerController.UpdatePOST);

router.get('/UpdateCustomer/:email', ensureAuthenticated, customerController.UpdateGET);

module.exports = router;
