import express from 'express';
import protect from '../../middleware/auth.js';
import { upload } from '../../middleware/uploadMiddleware.js';

import {
    addUserStory,
    getUserStories,
} from '../../controllers/Media/storyController.js';

const router = express.Router();

router.post('/add', protect, upload.single('media'), addUserStory);
router.get('/get', protect, getUserStories);

export default router;