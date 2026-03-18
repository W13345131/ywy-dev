import express from 'express';

// getDashboard	获取仪表盘数据
import {
    getDashboard,
} from '../controllers/progressController.js'

import protect from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

// 获取仪表盘数据
router.get('/dashboard', getDashboard)

export default router;