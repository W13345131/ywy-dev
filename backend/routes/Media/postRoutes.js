import express from 'express';
import protect from '../../middleware/auth.js';
import { upload } from '../../middleware/uploadMiddleware.js';

import {
    addPost,
    getPosts,
    likePost,
} from '../../controllers/Media/postController.js';

const router = express.Router();

router.post('/add', protect, upload.array('images', 4), addPost);
router.get('/get', protect, getPosts);
router.post('/like', protect, likePost);

export default router;