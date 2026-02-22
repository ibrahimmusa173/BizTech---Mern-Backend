const User = require('../models/User');
const Tender = require('../models/Tender');
const Proposal = require('../models/Proposal');

const adminController = {
    // 1) User Management: View and block/unblock accounts
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({ user_type: { $ne: 'admin' } }).select('-password');
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    toggleBlockUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.is_blocked = !user.is_blocked;
            await user.save();

            const status = user.is_blocked ? "blocked" : "unblocked";
            res.status(200).json({ success: true, message: `User ${status} successfully` });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 2) Tender Management: View all tenders
    getAllTenders: async (req, res) => {
        try {
            const tenders = await Tender.find().populate('client_id', 'name company_name');
            res.status(200).json({ success: true, data: tenders });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 3) Tender Management: Approve or reject tenders
    updateTenderStatus: async (req, res) => {
        try {
            const { status } = req.body; // Expecting 'active' or 'rejected'
            if (!['active', 'rejected'].includes(status)) {
                return res.status(400).json({ message: "Invalid status selection" });
            }

            const tender = await Tender.findByIdAndUpdate(req.params.id, { status }, { new: true });
            if (!tender) return res.status(404).json({ message: "Tender not found" });

            res.status(200).json({ success: true, message: `Tender ${status} successfully` });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 4) Proposal Management: View all proposals
    getAllProposals: async (req, res) => {
        try {
            const proposals = await Proposal.find()
                .populate('vendor_id', 'name company_name')
                .populate('tender_id', 'title');
            res.status(200).json({ success: true, data: proposals });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 5) Analytics and Reporting
    getPlatformStats: async (req, res) => {
        try {
            const userCount = await User.countDocuments({ user_type: { $ne: 'admin' } });
            const tenderCount = await Tender.countDocuments();
            const proposalCount = await Proposal.countDocuments();

            res.status(200).json({
                success: true,
                data: {
                    totalUsers: userCount,
                    totalTenders: tenderCount,
                    totalProposals: proposalCount
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = adminController;