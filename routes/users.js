const express = require('express');
const router = express.Router();
// Load User Controller
const userController = require('../controllers/user.controller')

//Register Routes
// Login Page
router.get('/login', userController.login);
// Register Page
router.get('/register', userController.register);

// Register
router.post('/register', userController.registerUser);

// Login
router.post('/login', userController.loginUser);

// Logout
router.get('/logout', userController.logout);

module.exports = router;
