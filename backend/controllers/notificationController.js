const Notification = require('../models/Notification');

// GET Notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark As Read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.id },
            { is_read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        res.status(200).json({ success: true });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};