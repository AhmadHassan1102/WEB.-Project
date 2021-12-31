const express = require('express');
const router = express.Router();
// Load Role Controller
const roleController = require('../controllers/Role.controller');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

//Register Routes
// Login Page
router.get('/login',forwardAuthenticated, roleController.login);

// Login
router.post('/login', roleController.loginRole);
// Register Page
router.get('/register',forwardAuthenticated, roleController.register);

// Login
router.post('/register', roleController.registerRole);

// Logout
router.get('/logout', roleController.logout);

// Dashboard
router.get("/dashboard", ensureAuthenticated,roleController.dashboard);

router.get("/patientdashboard", ensureAuthenticated,roleController.patientdashboard);

module.exports = router;
