const express = require('express');
const {
    getNotifications,
    markAsRead
} = require('../controllers/notificationController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markAsRead);

module.exports = router;