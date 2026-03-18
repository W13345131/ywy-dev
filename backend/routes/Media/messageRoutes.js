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

router.get('/:userId', protect, sseController);
router.post('/send', protect, upload.single('image'), sendMessage);
router.get('/messages', protect, getMessages);
router.get('/recent', protect, getRecentMessages);

export default router;