import express from 'express';
import protect from '../../middleware/auth.js';
import { upload } from '../../middleware/uploadMiddleware.js';

import {
    addUserStory,
    getUserStories,
} from '../../controllers/Media/storyController.js';

const router = express.Router();

// 添加故事
router.post('/add', protect, upload.single('media'), addUserStory);
// 获取故事
router.get('/get', protect, getUserStories);

export default router;