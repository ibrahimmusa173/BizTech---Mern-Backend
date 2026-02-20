const express = require('express');
const {
    submitProposal,
    getVendorProposals,
    withdrawProposal,
    getTenderProposals,
    updateProposalStatus
} = require('../controllers/proposalController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Vendor Routes
router.post('/proposals', protect, submitProposal);
router.get('/proposals/vendor', protect, getVendorProposals);
router.put('/proposals/:id/withdraw', protect, withdrawProposal);

// Client Routes
router.get('/tenders/:tenderId/proposals', protect, getTenderProposals);
router.put('/proposals/:id/status', protect, updateProposalStatus);

module.exports = router;