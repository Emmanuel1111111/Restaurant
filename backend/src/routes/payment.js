import express from 'express';
import { body } from 'express-validator';
import {paystackWebhook,verifyPayments, initializePayments} from '../controllers/paymentController.js';
import {auth} from '../middleware/auth.js';
import {validateRequest }from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/initialize', auth, initializePayments);
router.get('/verify/:reference', auth,verifyPayments);
router.post('/webhook', paystackWebhook);

export default router;
