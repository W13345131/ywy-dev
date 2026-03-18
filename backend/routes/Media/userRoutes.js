import express from 'express';
import protect from '../../middleware/auth.js';
import upload from '../../config/multer.js';

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

router.get('/data', protect, getUserData);
router.put('/update', protect, upload.fields(
    [
        { name: 'profileImageUrl', maxCount: 1 },
        { name: 'coverImageUrl', maxCount: 1 },
    ]
), updateUserData);

router.get('/discover', protect, discoverUsers);
router.post('/follow', protect, followUser);
router.post('/unfollow', protect, unfollowUser);
router.post('/connect', protect, sendConnectionRequest);
router.get('/connections', protect, getUserConnections);
router.post('/accept', protect, acceptConnectionRequest);
router.get('/profiles', protect, getUserProfiles);
router.get('/recent-messages', protect, getRecentMessages);


export default router;