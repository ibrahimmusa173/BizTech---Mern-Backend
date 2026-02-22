const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    toggleBlockUser, 
    getAllTenders, 
    updateTenderStatus, 
    getAllProposals, 
    getPlatformStats 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here require login and admin role
router.use(protect);
router.use(authorize('admin'));

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);

// Tender Management
router.get('/tenders', getAllTenders);
router.put('/tenders/:id/status', updateTenderStatus);

// Proposal Management
router.get('/proposals', getAllProposals);

// Analytics
router.get('/stats', getPlatformStats);

module.exports = router;