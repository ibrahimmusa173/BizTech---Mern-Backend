const Tender = require('../models/Tender');

const tenderController = {
    // CLIENT: Create a new tender
    createTender: async (req, res) => {
        try {
            if (req.user.user_type !== 'client') {
                return res.status(403).json({ success: false, message: "Only clients can create tenders." });
            }

            const tender = await Tender.create({
                ...req.body,
                client_id: req.user.id
            });

            res.status(201).json({ success: true, message: "Tender created successfully", tenderId: tender._id });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error creating tender.", error: error.message });
        }
    },

    // CLIENT: Get all tenders for a specific client
    getClientTenders: async (req, res) => {
        try {
            const tenders = await Tender.find({ client_id: req.user.id });
            res.status(200).json({ success: true, data: tenders });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error fetching your tenders.", error: error.message });
        }
    },

    // VENDOR/PUBLIC: View single tender details (WITH PREMIUM LOGIC)
    getTenderDetails: async (req, res) => {
        try {
            let tender = await Tender.findById(req.params.id);
            if (!tender) return res.status(404).json({ success: false, message: "Tender not found." });

            // LOGIC: Populate client info ONLY if Vendor is Premium OR User is the Owner (Client)
            if ((req.user.user_type === 'vendor' && req.user.isPremium) || 
                (req.user.user_type === 'client' && tender.client_id.toString() === req.user.id.toString())) {
                tender = await Tender.findById(req.params.id).populate('client_id', 'name email company_name');
            }

            res.status(200).json({ success: true, data: tender });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error fetching tender details.", error: error.message });
        }
    },

    // VENDOR: Search tenders
    searchTenders: async (req, res) => {
        try {
            const { q } = req.query;

            if (!q || q.trim() === '') {
                const tenders = await Tender.find({ status: 'active' });
                return res.status(200).json({ success: true, data: tenders });
            }

            // Atlas Search pipeline
            const tenders = await Tender.aggregate([
                {
                    $search: {
                        index: 'default',
                        compound: {
                            should: [
                                { autocomplete: { query: q, path: 'title', fuzzy: { maxEdits: 1 } } },
                                { autocomplete: { query: q, path: 'category', fuzzy: { maxEdits: 1 } } },
                                { text: { query: q, path: 'description', fuzzy: { maxEdits: 1 } } }
                            ]
                        }
                    }
                },
                { $match: { status: 'active' } },
                { $addFields: { score: { $meta: 'searchScore' } } },
                { $sort: { score: -1 } },
                { $limit: 20 }
            ]);

            res.status(200).json({ success: true, data: tenders });

        } catch (error) {
            res.status(500).json({ success: false, message: "Search failed.", error: error.message });
        }
    },

    // CLIENT: Close a tender
    closeTender: async (req, res) => {
        try {
            const tender = await Tender.findOneAndUpdate(
                { _id: req.params.id, client_id: req.user.id },
                { status: 'closed' },
                { new: true }
            );
            if (!tender) return res.status(404).json({ message: "Tender not found or unauthorized." });
            res.status(200).json({ success: true, message: "Tender closed successfully." });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error closing tender.", error: error.message });
        }
    },

    // CLIENT: Update tender deadline
    updateDeadline: async (req, res) => {
        try {
            const { deadline } = req.body;
            const tender = await Tender.findOneAndUpdate(
                { _id: req.params.id, client_id: req.user.id },
                { deadline: deadline },
                { new: true }
            );
            if (!tender) return res.status(404).json({ message: "Tender not found or unauthorized." });
            res.status(200).json({ success: true, message: "Tender deadline updated successfully." });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error updating deadline.", error: error.message });
        }
    },

    // VENDOR/PUBLIC: View all open tenders
    getAllOpenTenders: async (req, res) => {
        try {
            const tenders = await Tender.find({ status: 'active' });
            res.status(200).json({ success: true, data: tenders });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error fetching tenders.", error: error.message });
        }
    }
};

module.exports = tenderController;