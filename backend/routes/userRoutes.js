const express = require('express');
const authController = require('../controllers/authController'); 
const router = express.Router();

// Only define routes if the function actually exists in authController
router.put("/update/:id", authController.updateProfile);

module.exports = router;