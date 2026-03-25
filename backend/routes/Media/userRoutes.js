import express from 'express';
import protect from '../../middleware/auth.js';
import { upload } from '../../middleware/uploadMiddleware.js';

import {
    getUserData,
    updateUserData,
    discoverUsers,
    followUser,
    unfollowUser,
    sendConnectionRequest,
    getUserConnections,
    acceptConnectionRequest,
    getUserProfiles,
} from '../../controllers/Media/userController.js';

import {
    getRecentMessages,
} from '../../controllers/Media/messageController.js';

const router = express.Router();

// 获取用户数据
router.get('/data', protect, getUserData);
// 更新用户数据
router.put('/update', protect, upload.fields(
    [
        // 头像
        { name: 'profileImageUrl', maxCount: 1 },
        // 封面
        { name: 'coverImageUrl', maxCount: 1 },
    ]
), updateUserData);

// 发现用户
router.get('/discover', protect, discoverUsers);
// 关注用户
router.post('/follow', protect, followUser);
// 取消关注用户
router.post('/unfollow', protect, unfollowUser);
// 发送连接请求
router.post('/connect', protect, sendConnectionRequest);
// 获取用户连接
router.get('/connections', protect, getUserConnections);
// 接受连接请求
router.post('/accept', protect, acceptConnectionRequest);
// 获取用户资料
router.get('/profiles/:profileId', protect, getUserProfiles);
// 获取用户资料
router.get('/profiles', protect, getUserProfiles);
// 获取最近消息
router.get('/recent-messages', protect, getRecentMessages);


export default router;