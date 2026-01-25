// backend/routes/userRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// GET all users
router.get("/", authController.getAllUsers);

module.exports = router;