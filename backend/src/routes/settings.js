import express from 'express';
import {getSettings, updateSettings,toggleAcceptingOrders} from '../controllers/settingsController.js';
import {auth, isStaff} from '../middleware/auth.js';
          
const router = express.Router();

router.get('/setting', getSettings);
router.put('/Update/setting', auth, isStaff, updateSettings);
router.patch('/setting/toggle-orders', auth, isStaff, toggleAcceptingOrders);

export default router;
