const Proposal = require('../models/Proposal');
const Tender = require('../models/Tender');
const Notification = require('../models/Notification');

const proposalController = {
    // VENDOR: Submit Proposal
    submitProposal: async (req, res) => {
        try {
            // Changed 'bidder' to 'vendor' to match User model enum
            if (req.user.user_type !== 'vendor') {
                return res.status(403).json({ message: "Only vendors can submit proposals." });
            }

            const proposal = await Proposal.create({
                ...req.body,
                vendor_id: req.user.id
            });

            // Notify Client about new proposal
            const tender = await Tender.findById(req.body.tender_id);
            if (tender) {
                await Notification.create({
                    user_id: tender.client_id,
                    message: `A new proposal has been submitted for your tender: ${tender.title}`
                });
            }

            res.status(201).json({ success: true, message: "Proposal submitted successfully", proposalId: proposal._id });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error submitting proposal.", error: error.message });
        }
    },

    // VENDOR: View their own submitted proposals
    getVendorProposals: async (req, res) => {
        try {
            const proposals = await Proposal.find({ vendor_id: req.user.id }).populate('tender_id', 'title');
            res.status(200).json({ success: true, data: proposals });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error fetching your proposals.", error: error.message });
        }
    },

    // VENDOR: Withdraw a proposal
    withdrawProposal: async (req, res) => {
        try {
            const proposal = await Proposal.findOneAndUpdate(
                { _id: req.params.id, vendor_id: req.user.id },
                { status: 'withdrawn' },
                { new: true }
            );
            if (!proposal) return res.status(404).json({ message: "Proposal not found or unauthorized." });
            res.status(200).json({ success: true, message: "Proposal withdrawn successfully." });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error withdrawing proposal.", error: error.message });
        }
    },

    // CLIENT: View proposals for their tender
    getTenderProposals: async (req, res) => {
        try {
            const proposals = await Proposal.find({ tender_id: req.params.tenderId }).populate('vendor_id', 'name company_name');
            res.status(200).json({ success: true, data: proposals });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error fetching proposals.", error: error.message });
        }
    },

    // CLIENT: Accept or Reject a proposal
    updateProposalStatus: async (req, res) => {
        try {
            const { status } = req.body; // 'accepted' or 'rejected'
            const validStatuses = ['accepted', 'rejected'];
            
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status." });
            }

            const proposal = await Proposal.findByIdAndUpdate(req.params.id, { status }, { new: true });
            if (!proposal) return res.status(404).json({ message: "Proposal not found." });

            // Notify Vendor about status update
            await Notification.create({
                user_id: proposal.vendor_id,
                message: `Your proposal status has been updated to: ${status}`
            });

            res.status(200).json({ success: true, message: `Proposal marked as ${status}.` });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error updating status.", error: error.message });
        }
    }
};

module.exports = proposalController;