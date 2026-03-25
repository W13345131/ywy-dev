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

// 添加帖子
router.post('/add', protect, upload.array('images', 4), addPost);
// 获取帖子
router.get('/get', protect, getPosts);
// 点赞帖子
router.post('/like', protect, likePost);
// 获取帖子评论
router.get('/:postId/comments', protect, getPostComments);
// 添加帖子评论
router.post('/:postId/comments', protect, addPostComment);
// 添加帖子评论回复
router.post('/:postId/comments/:commentId/replies', protect, addCommentReply);

// 导出路由
export default router;