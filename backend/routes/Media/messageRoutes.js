import express from 'express';
// 导入认证中间件
import protect from '../../middleware/auth.js';
// 导入上传中间件
import { upload } from '../../middleware/uploadMiddleware.js';

// 导入消息控制器
import {
    // SSE 控制器
    sseController,
    // 发送消息
    sendMessage,
    // 获取消息
    getMessages,
    // 获取最近消息
    getRecentMessages,
} from '../../controllers/Media/messageController.js';

// 创建路由实例
const router = express.Router();

// 获取最近消息
router.get('/recent', protect, getRecentMessages);
// 获取消息
router.get('/conversation/:userId', protect, getMessages);
// 发送消息
router.post('/send', protect, upload.single('image'), sendMessage);
// SSE 控制器
router.get('/stream/:userId', protect, sseController);

export default router;