const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
// Load User Controller
const adminController = require('../controllers/admin.controller');
const patientController = require('../controllers/patient.controller');

// ShowData
router.get('/dashboard', ensureAuthenticated, adminController.show);

router.get('/ADDDoctor', ensureAuthenticated, adminController.doctorget);

router.post('/ADDDoctor', ensureAuthenticated, adminController.DoctorPOST);

router.get('/DisplayDoctor', ensureAuthenticated, adminController.doctorDisplay);

router.get('/DisplayDoctor/:page', ensureAuthenticated, adminController.doctorDisplay);

router.post('/DisplayDoctor', ensureAuthenticated, adminController.DoctorPOST);

router.get('/DisplayDelete/:email', ensureAuthenticated, adminController.doctorDelete);

router.get('/ViewDoctor/:email', ensureAuthenticated, adminController.doctorDisplay1);

router.post('/SearchDoctor', ensureAuthenticated, adminController.SearchDoctor);

router.post('/UpdateDoctor/:doctor', ensureAuthenticated, adminController.UpdatePOST);

router.get('/UpdateDoctor/:email', ensureAuthenticated, adminController.UpdateGET);
//PATIENT
router.get('/ADDPatient', ensureAuthenticated, patientController.patientget);

router.post('/ADDPatient', ensureAuthenticated, patientController.PatientPOST);

router.get('/DisplayPatient', ensureAuthenticated, patientController.patientDisplay);

router.get('/DisplayPatient/:page', ensureAuthenticated, patientController.patientDisplay);

router.post('/DisplayPatient', ensureAuthenticated, patientController.PatientPOST);

router.get('/PatientDelete/:email', ensureAuthenticated, patientController.patientDelete);

router.get('/ViewPatient/:email', ensureAuthenticated, patientController.patientDisplay1);

router.post('/SearchPatient', ensureAuthenticated, patientController.SearchPatient);

router.post('/UpdatePatient/:patient', ensureAuthenticated, patientController.UpdatePOST);

router.get('/UpdatePatient/:email', ensureAuthenticated, patientController.UpdateGET);

router.get('/ReceviedPatient/:email', ensureAuthenticated, patientController.assign);
module.exports = router;
