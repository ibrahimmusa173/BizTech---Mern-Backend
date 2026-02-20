const Proposal = require('../models/Proposal');
const Tender = require('../models/Tender');
const Notification = require('../models/Notification');

// VENDOR → Submit Proposal
exports.submitProposal = async (req, res) => {
    try {
        if (req.user.user_type !== 'vendor') {
            return res.status(403).json({ message: "Only vendors can submit proposals." });
        }

        const proposal = await Proposal.create({
            ...req.body,
            vendor_id: req.user.id
        });

        // Notify Client
        const tender = await Tender.findById(req.body.tender_id);

        if (tender) {
            await Notification.create({
                user_id: tender.client_id,
                message: `New proposal submitted for tender: ${tender.title}`
            });
        }

        res.status(201).json({
            success: true,
            proposalId: proposal._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// VENDOR → My Proposals
exports.getVendorProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({ vendor_id: req.user.id })
            .populate('tender_id', 'title deadline status');

        res.status(200).json(proposals);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// VENDOR → Withdraw Proposal
exports.withdrawProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findOneAndUpdate(
            { _id: req.params.id, vendor_id: req.user.id },
            { status: 'withdrawn' },
            { new: true }
        );

        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found." });
        }

        res.status(200).json({ success: true, message: "Proposal withdrawn." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CLIENT → View Proposals for Tender
exports.getTenderProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({ tender_id: req.params.tenderId })
            .populate('vendor_id', 'name company_name');

        res.status(200).json(proposals);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CLIENT → Accept / Reject Proposal
exports.updateProposalStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const proposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found." });
        }

        // Notify Vendor
        await Notification.create({
            user_id: proposal.vendor_id,
            message: `Your proposal has been ${status}`
        });

        res.status(200).json({
            success: true,
            message: `Proposal ${status}`
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};