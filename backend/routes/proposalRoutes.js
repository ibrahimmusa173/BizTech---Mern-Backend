const express = require('express');

const {
    submitProposal,
    getVendorProposals,
    withdrawProposal,
    getTenderProposals,
    updateProposalStatus
} = require('../controllers/proposalController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Vendor Routes
router.post('/proposals', protect, authorize('vendor'), submitProposal);

router.get('/proposals/vendor', protect, authorize('vendor'), getVendorProposals);

router.put('/proposals/:id/withdraw', protect, authorize('vendor'), withdrawProposal);

// Client Routes
router.get('/tenders/:tenderId/proposals', protect, authorize('client'), getTenderProposals);

router.put('/proposals/:id/status', protect, authorize('client'), updateProposalStatus);

module.exports = router;