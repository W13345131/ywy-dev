import express from 'express';
import protect from '../../middleware/auth.js';
import { upload } from '../../middleware/uploadMiddleware.js';

import {
    sseController,
    sendMessage,
    getMessages,
    getRecentMessages,
} from '../../controllers/Media/messageController.js';

const router = express.Router();

router.get('/recent', protect, getRecentMessages);
router.get('/conversation/:userId', protect, getMessages);
router.post('/send', protect, upload.single('image'), sendMessage);
router.get('/stream/:userId', protect, sseController);

export default router;