const express = require('express');
const router = express.Router();

// Import the controller object
const {
    createTender,
    getClientTenders,
    closeTender,
    updateDeadline,
    getAllOpenTenders,
    getTenderDetails,
    searchTenders
} = require('../controllers/tenderController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Client Routes
router.post('/tenders', protect, authorize('client'), createTender);
router.get('/tenders/client', protect, authorize('client'), getClientTenders);
router.put('/tenders/:id/close', protect, authorize('client'), closeTender);
router.put('/tenders/:id/deadline', protect, authorize('client'), updateDeadline);

// Vendor Routes
router.get('/tenders', protect, authorize('vendor'), getAllOpenTenders);
router.get('/tenders/search', protect, authorize('vendor'), searchTenders); 

// Vendor + Client
// This is likely where your error was (Line 20-ish)
router.get('/tenders/:id', protect, authorize('vendor','client'), getTenderDetails);

module.exports = router;