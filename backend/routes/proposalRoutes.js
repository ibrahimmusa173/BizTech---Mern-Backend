const express = require('express');

const {
    submitProposal,
    getVendorProposals,
    withdrawProposal,
    getTenderProposals,
    updateProposalStatus
} = require('../controllers/proposalController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Vendor Routes
router.post('/proposals', protect, authorizeRoles('vendor'), submitProposal);

router.get('/proposals/vendor', protect, authorizeRoles('vendor'), getVendorProposals);

router.put('/proposals/:id/withdraw', protect, authorizeRoles('vendor'), withdrawProposal);

// Client Routes
router.get('/tenders/:tenderId/proposals', protect, authorizeRoles('client'), getTenderProposals);

router.put('/proposals/:id/status', protect, authorizeRoles('client'), updateProposalStatus);

module.exports = router;