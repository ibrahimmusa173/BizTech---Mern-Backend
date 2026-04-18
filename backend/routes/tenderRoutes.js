const express = require('express');

const {
    createTender,
    getClientTenders,
    closeTender,
    updateDeadline,
    getAllOpenTenders,
    getTenderDetails
} = require('../controllers/tenderController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Client Routes
router.post('/tenders', protect, authorize('client'), createTender);

router.get('/tenders/client', protect, authorize('client'), getClientTenders);

router.put('/tenders/:id/close', protect, authorize('client'), closeTender);

router.put('/tenders/:id/deadline', protect, authorize('client'), updateDeadline);

// Vendor Routes
router.get('/tenders', protect, authorize('vendor'), getAllOpenTenders);

// Vendor + Client
router.get('/tenders/:id', protect, authorize('vendor','client'), getTenderDetails);

module.exports = router;