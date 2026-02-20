const express = require('express');
const {
    createTender,
    getClientTenders,
    closeTender,
    updateDeadline,
    getAllOpenTenders,
    getTenderDetails
} = require('../controllers/tenderController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Client Routes
router.post('/tenders', protect, createTender);
router.get('/tenders/client', protect, getClientTenders);
router.put('/tenders/:id/close', protect, closeTender);
router.put('/tenders/:id/deadline', protect, updateDeadline);

// Vendor/Public Routes
router.get('/tenders', protect, getAllOpenTenders);
router.get('/tenders/:id', protect, getTenderDetails);

module.exports = router;