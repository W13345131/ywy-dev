import express from 'express';
import protect from '../../middleware/auth.js';
import { upload } from '../../middleware/uploadMiddleware.js';

import {
    addPost,
    getPosts,
    likePost,
    getPostComments,
    addPostComment,
    addCommentReply,
} from '../../controllers/Media/postController.js';

const router = express.Router();

router.post('/add', protect, upload.array('images', 4), addPost);
router.get('/get', protect, getPosts);
router.post('/like', protect, likePost);
router.get('/:postId/comments', protect, getPostComments);
router.post('/:postId/comments', protect, addPostComment);
router.post('/:postId/comments/:commentId/replies', protect, addCommentReply);

export default router;