const express = require('express');

const {
    createTender,
    getClientTenders,
    closeTender,
    updateDeadline,
    getAllOpenTenders,
    getTenderDetails
} = require('../controllers/tenderController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Client Routes
router.post('/tenders', protect, authorizeRoles('client'), createTender);

router.get('/tenders/client', protect, authorizeRoles('client'), getClientTenders);

router.put('/tenders/:id/close', protect, authorizeRoles('client'), closeTender);

router.put('/tenders/:id/deadline', protect, authorizeRoles('client'), updateDeadline);

// Vendor Routes
router.get('/tenders', protect, authorizeRoles('vendor'), getAllOpenTenders);

// Vendor + Client
router.get('/tenders/:id', protect, authorizeRoles('vendor','client'), getTenderDetails);

module.exports = router;