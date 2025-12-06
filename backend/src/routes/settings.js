const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { auth, isStaff } = require('../middleware/auth');

router.get('/', settingsController.getSettings);
router.put('/', auth, isStaff, settingsController.updateSettings);
router.patch('/toggle-orders', auth, isStaff, settingsController.toggleAcceptingOrders);

module.exports = router;
