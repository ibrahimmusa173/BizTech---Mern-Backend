const Tender = require('../models/Tender');

// CLIENT → Create Tender
exports.createTender = async (req, res) => {
    try {
        if (req.user.user_type !== 'client') {
            return res.status(403).json({ message: "Only clients can create tenders." });
        }

        const tender = await Tender.create({
            ...req.body,
            client_id: req.user.id
        });

        res.status(201).json({
            success: true,
            tenderId: tender._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CLIENT → Get Client Tenders
exports.getClientTenders = async (req, res) => {
    try {
        const tenders = await Tender.find({ client_id: req.user.id });
        res.status(200).json(tenders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CLIENT → Close Tender
exports.closeTender = async (req, res) => {
    try {
        const tender = await Tender.findOneAndUpdate(
            { _id: req.params.id, client_id: req.user.id },
            { status: 'closed' },
            { new: true }
        );

        if (!tender) {
            return res.status(404).json({ message: "Tender not found." });
        }

        res.status(200).json({ success: true, message: "Tender closed." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CLIENT → Update Deadline
exports.updateDeadline = async (req, res) => {
    try {
        const { deadline } = req.body;

        const tender = await Tender.findOneAndUpdate(
            { _id: req.params.id, client_id: req.user.id },
            { deadline },
            { new: true }
        );

        if (!tender) {
            return res.status(404).json({ message: "Tender not found." });
        }

        res.status(200).json({ success: true, message: "Deadline updated." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// VENDOR/PUBLIC → All Open Tenders
exports.getAllOpenTenders = async (req, res) => {
    try {
        const tenders = await Tender.find({ status: 'open' }).populate('client_id', 'name company_name');
        res.status(200).json(tenders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// → Tender Details
exports.getTenderDetails = async (req, res) => {
    try {
        const tender = await Tender.findById(req.params.id).populate('client_id', 'name company_name');

        if (!tender) {
            return res.status(404).json({ message: "Tender not found." });
        }

        res.status(200).json(tender);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};